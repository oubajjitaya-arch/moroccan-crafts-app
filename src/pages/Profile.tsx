import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { User, Mail, MapPin, Briefcase, Package, XCircle } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  
  const [orders, setOrders] = useState([
    { id: 'CMD-8492', date: '2026-06-01', total: '420 DH', status: 'En préparation' },
    { id: 'CMD-3910', date: '2026-05-28', total: '980 DH', status: 'Livrée' },
  ]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isClient = user.role === 'client';

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm('Voulez-vous vraiment annuler cette commande ?')) {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: 'Annulée' } : order
      ));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-bold text-gray-900 border-b pb-6 inline-block w-full">À propos</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Main Profile Info */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary text-4xl font-bold uppercase">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
                <div className="flex items-center gap-2 text-gray-500 mt-2 font-medium capitalize">
                  <Briefcase className="w-4 h-4" />
                  {user.role}
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">
                    <Mail className="w-4 h-4" />
                    Adresse Email
                  </div>
                  <p className="text-gray-900 font-medium text-lg">{user.email}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">
                    <MapPin className="w-4 h-4" />
                    Pays
                  </div>
                  <p className="text-gray-900 font-medium text-lg">Maroc</p>
                </div>
              </div>
              
              <div className="pt-4">
                <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-3 block">
                  Biographie
                </span>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <p className="text-gray-600 leading-relaxed">
                    {isClient 
                      ? "Passionné par l'artisanat marocain traditionnel et les savoir-faire ancestraux. En tant que client de la plateforme, je parcours les villes pour découvrir les créations authentiques en poterie, tapis et autres spécialités manuelles."
                      : "Artisan créateur dédié à la préservation du patrimoine manuel marocain. Engagé dans la transmission de notre héritage culturel à travers des créations uniques et authentiques qui racontent l'histoire de notre pays."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Section (for clients only) */}
          {isClient && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-6 h-6 text-gray-900" />
                <h3 className="text-2xl font-bold text-gray-900">Historique des commandes</h3>
              </div>
              
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div>
                      <div className="font-bold text-gray-900 mb-1">Commande #{order.id}</div>
                      <div className="text-sm text-gray-500">Passée le {order.date} • {order.total}</div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 min-w-[200px] justify-between">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${order.status === 'Livrée' ? 'bg-green-100 text-green-800' : order.status === 'Annulée' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                        {order.status}
                      </span>
                      
                      {order.status !== 'Livrée' && order.status !== 'Annulée' && (
                        <button 
                          onClick={() => handleCancelOrder(order.id)}
                          className="flex items-center gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Details Box */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-32">
            <div className="bg-gray-900 px-6 py-4">
              <h3 className="text-lg font-bold text-white">
                Détails {isClient ? 'Client' : 'Artisan'}
              </h3>
            </div>
            <div className="p-6">
              <ul className="space-y-5">
                <li className="flex justify-between items-center border-b border-gray-50 pb-4">
                  <span className="text-gray-500">Membre depuis</span>
                  <span className="font-bold text-gray-900">Juin 2026</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-50 pb-4">
                  <span className="text-gray-500">Statut du compte</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                    Actif
                  </span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-50 pb-4">
                  <span className="text-gray-500">{isClient ? 'Commandes' : 'Produits'}</span>
                  <span className="font-bold text-gray-900 text-lg">{isClient ? orders.length : 0}</span>
                </li>
                <li className="flex justify-between items-center pt-2">
                  <span className="text-gray-500">Vérification</span>
                  <span className="font-bold text-primary flex items-center gap-1 text-sm">
                    En attente
                  </span>
                </li>
              </ul>
              
              <button className="w-full mt-8 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 font-medium py-3 rounded-xl transition-colors">
                Editer le profil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
