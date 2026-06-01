import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
          A
        </div>
        <span className="font-semibold text-xl text-gray-900">Artisanat Marocain</span>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        <Link to="/" className="text-gray-900 font-medium hover:text-primary transition-colors">Accueil</Link>
        <Link to="/villes" className="text-gray-500 hover:text-primary transition-colors">Villes</Link>
        
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                <User className="w-4 h-4" />
              </div>
              <span className="font-medium">{user.name}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-500 hover:text-primary transition-colors flex items-center gap-1"
              title="Se déconnecter"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="text-gray-500 hover:text-primary transition-colors">Connexion</Link>
            <Link to="/login?mode=register" className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-md font-medium transition-colors">
              S'inscrire
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-[#f8f5f2] pt-20 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <span className="font-bold text-lg text-gray-900">Artisanat Marocain</span>
          </div>
          <p className="text-gray-600 max-w-sm leading-relaxed">
            Découvrez les trésors de l'artisanat traditionnel marocain et connectez-vous directement avec les artisans locaux.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-gray-900 mb-6">Navigation</h4>
          <ul className="space-y-4">
            <li><Link to="/" className="text-gray-600 hover:text-primary transition-colors">Accueil</Link></li>
            <li><Link to="/villes" className="text-gray-600 hover:text-primary transition-colors">Villes</Link></li>
            <li><Link to="/login" className="text-gray-600 hover:text-primary transition-colors">Connexion</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-6">Villes Populaires</h4>
          <ul className="space-y-4">
            <li><Link to="/ville/fes" className="text-gray-600 hover:text-primary transition-colors">Fès</Link></li>
            <li><Link to="/ville/marrakech" className="text-gray-600 hover:text-primary transition-colors">Marrakech</Link></li>
            <li><Link to="/ville/safi" className="text-gray-600 hover:text-primary transition-colors">Safi</Link></li>
            <li><Link to="/ville/tetouan" className="text-gray-600 hover:text-primary transition-colors">Tétouan</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500 pt-8 border-t border-gray-200">
        © 2026 Artisanat Marocain. Tous droits réservés.
      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-primary/20 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
