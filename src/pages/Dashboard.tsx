import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Edit2, Trash2, Plus, X, Search } from 'lucide-react';
import { cities } from '../data/cities';

interface Artisan {
  id: string;
  name: string;
  craft: string;
  cityId: string;
  description: string;
  phone: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    craft: '',
    cityId: 'fes',
    description: '',
    phone: ''
  });

  const fetchArtisans = async () => {
    try {
      const res = await fetch('/api/artisans');
      const data = await res.json();
      setArtisans(data);
    } catch (err) {
      console.error("Erreur lors du chargement des artisans", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtisans();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData({ name: '', craft: '', cityId: 'fes', description: '', phone: '' });
    setIsFormOpen(true);
  };

  const openEditForm = (artisan: Artisan) => {
    setEditingId(artisan.id);
    setFormData({
      name: artisan.name,
      craft: artisan.craft,
      cityId: artisan.cityId,
      description: artisan.description || '',
      phone: artisan.phone || ''
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update
        await fetch(`/api/artisans/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        // Create
        await fetch('/api/artisans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      setIsFormOpen(false);
      fetchArtisans();
    } catch (err) {
      console.error("Erreur d'enregistrement", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet artisan ?')) return;
    try {
      await fetch(`/api/artisans/${id}`, { method: 'DELETE' });
      fetchArtisans();
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
    }
  };

  const getCityName = (cityId: string) => {
    return cities.find(c => c.id === cityId)?.name || cityId;
  };

  if (!user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-gray-500">Veuillez vous connecter pour accéder au tableau de bord.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Artisans</h1>
          <p className="text-gray-500 mt-2">Gérez la liste complète des artisans de la plateforme.</p>
        </div>
        <button 
          onClick={openAddForm}
          className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-md font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Ajouter un artisan
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                {editingId ? 'Modifier l\'artisan' : 'Nouvel artisan'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input required name="name" value={formData.name} onChange={handleInputChange} type="text" className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité (ex: Poterie)</label>
                  <input required name="craft" value={formData.craft} onChange={handleInputChange} type="text" className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <select name="cityId" value={formData.cityId} onChange={handleInputChange} className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white">
                    {cities.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input name="phone" value={formData.phone} onChange={handleInputChange} type="text" className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"></textarea>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                  Annuler
                </button>
                <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-md font-medium transition-colors">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Artisans List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Chargement...</div>
        ) : artisans.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Aucun artisan trouvé.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold text-gray-900">Nom</th>
                  <th className="px-6 py-4 font-semibold text-gray-900">Spécialité</th>
                  <th className="px-6 py-4 font-semibold text-gray-900">Ville</th>
                  <th className="px-6 py-4 font-semibold text-gray-900">Contact</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {artisans.map(artisan => (
                  <tr key={artisan.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{artisan.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-primary border border-rose-100">
                        {artisan.craft}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {getCityName(artisan.cityId)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {artisan.phone || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => openEditForm(artisan)} 
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-rose-50 rounded-md transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(artisan.id)} 
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
