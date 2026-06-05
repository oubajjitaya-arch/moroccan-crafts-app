import express from 'express';
import { createServer as createViteServer } from 'vite';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev';
const users: any[] = []; // In-memory database for users

let artisans: any[] = [
  { id: '1', name: 'Ahmed', craft: 'Poterie', cityId: 'fes', description: 'Artisan potier depuis plus de 20 ans, spécialiste du bleu de Fès.', phone: '+212 6 00 11 22 33' },
  { id: '2', name: 'Fatima', craft: 'Zellige', cityId: 'fes', description: 'Maître zelligeuse créant des motifs géométriques traditionnels.', phone: '+212 6 00 11 22 34' },
  { id: '3', name: 'Youssef', craft: 'Cuir', cityId: 'marrakech', description: 'Maroquinier produisant des babouches et sacs de haute qualité.', phone: '+212 6 00 11 22 35' },
  { id: '4', name: 'Amina', craft: 'Tapis', cityId: 'marrakech', description: 'Tisseuse de tapis berbères uniques et colorés.', phone: '+212 6 00 11 22 36' },
  { id: '5', name: 'Hassan', craft: 'Céramique', cityId: 'safi', description: 'Céramiste passionné de Safi, réputé pour ses tajines robustes.', phone: '+212 6 00 11 22 37' },
  { id: '6', name: 'Khadija', craft: 'Poterie émaillée', cityId: 'safi', description: 'Créatrice de poteries émaillées aux couleurs vives.', phone: '+212 6 00 11 22 38' },
  { id: '7', name: 'Said', craft: 'Broderie', cityId: 'tetouan', description: 'Spécialiste de la broderie au fil d\'or pour caftans.', phone: '+212 6 00 11 22 39' },
  { id: '8', name: 'Nadia', craft: 'Textile', cityId: 'tetouan', description: 'Tisserande de tissus andalous traditionnels.', phone: '+212 6 00 11 22 40' },
  { id: '9', name: 'Omar', craft: 'Cuir', cityId: 'marrakech', description: 'Travail du cuir brut dans les tanneries ancestrales.', phone: '+212 6 00 11 22 41' },
  { id: '10', name: 'Rachid', craft: 'Dinanderie', cityId: 'fes', description: 'Artisan dinandier sculptant des lanternes en laiton et cuivre.', phone: '+212 6 00 11 22 42' }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes (Artisans CRUD)
  app.get('/api/artisans', (req, res) => {
    res.json(artisans);
  });

  app.get('/api/artisans/:id', (req, res) => {
    const artisan = artisans.find(a => a.id === req.params.id);
    if (!artisan) return res.status(404).json({ error: 'Artisan non trouvé' });
    res.json(artisan);
  });

  app.post('/api/artisans', (req, res) => {
    const { name, craft, cityId, description, phone } = req.body;
    if (!name || !craft || !cityId) {
      return res.status(400).json({ error: 'Nom, métier et ville sont requis' });
    }
    const newArtisan = { id: Date.now().toString(), name, craft, cityId, description, phone };
    artisans.push(newArtisan);
    res.status(201).json(newArtisan);
  });

  app.put('/api/artisans/:id', (req, res) => {
    const index = artisans.findIndex(a => a.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Artisan non trouvé' });
    
    artisans[index] = { ...artisans[index], ...req.body, id: artisans[index].id };
    res.json(artisans[index]);
  });

  app.delete('/api/artisans/:id', (req, res) => {
    const index = artisans.findIndex(a => a.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Artisan non trouvé' });
    
    const deleted = artisans.splice(index, 1);
    res.json(deleted[0]);
  });

  // Auth Routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
      }
      if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { id: Date.now().toString(), name, email, password: hashedPassword, role: role || 'client' };
      users.push(newUser);
      
      const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
      }
      const user = users.find(u => u.email === email);
      if (!user) {
        return res.status(400).json({ error: 'Identifiants invalides' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Identifiants invalides' });
      }
      
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Non autorisé' });
    const token = authHeader.split(' ')[1];
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = users.find(u => u.id === decoded.id);
      if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
      res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
      res.status(401).json({ error: 'Token invalide' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
