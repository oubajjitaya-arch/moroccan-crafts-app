import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, CheckCircle } from 'lucide-react';
import { calculateDynamicPrice } from '../utils/pricing';

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const total = cart.reduce((acc, item) => {
    const unitPrice = calculateDynamicPrice(item.product.price, item.product.stock ?? 0);
    return acc + (unitPrice * item.quantity);
  }, 0);

  const handleValidateOrder = () => {
    clearCart();
    setOrderSuccess(true);
  };

  if (orderSuccess) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="bg-green-50 rounded-2xl p-12 max-w-2xl mx-auto border border-green-100 flex flex-col items-center">
          <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Commande confirmée !</h1>
          <p className="text-lg text-gray-600 mb-8">
            Merci pour votre achat. Votre commande a été validée avec succès et est en cours de préparation.
          </p>
          <Link to="/" className="bg-primary hover:bg-primary-hover text-white font-medium px-8 py-4 rounded-xl transition-colors shadow-sm inline-flex items-center">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link to="/" className="inline-flex items-center text-gray-500 hover:text-primary mb-8 font-medium transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Continuer vos achats
      </Link>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Votre Panier</h1>
      
      {cart.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500 mb-6">Votre panier est actuellement vide.</p>
          <Link to="/" className="bg-primary hover:bg-primary-hover text-white font-medium px-6 py-3 rounded-md transition-colors">
            Découvrir nos produits
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
              {cart.map((item) => (
                <div key={item.product.id} className="p-6 flex items-center gap-6">
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                    <img 
                      src={item.product.image || 'https://images.unsplash.com/photo-1510218830377-2e994ea9087d?auto=format&fit=crop&q=80&w=1000'} 
                      alt={item.product.title} 
                      className="w-full h-full object-cover bg-gray-100"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{item.product.title}</h3>
                    <p className="text-gray-500 text-sm mb-2">
                      {calculateDynamicPrice(item.product.price, item.product.stock ?? 0)} DH unitaire
                      {(item.product.stock ?? 0) <= 5 && " (stock limité)"}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="font-medium bg-gray-100 px-3 py-1 rounded text-sm text-gray-700">
                        Quantité: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-3">
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      title="Retirer l'article"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <p className="font-bold text-lg text-primary">
                      {calculateDynamicPrice(item.product.price, item.product.stock ?? 0) * item.quantity} DH
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-4">Résumé de la commande</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{total} DH</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span>Gratuite</span>
                </div>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 mb-8 pt-4 border-t border-gray-100">
                <span>Total</span>
                <span>{total} DH</span>
              </div>
              <button 
                onClick={handleValidateOrder}
                className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-4 rounded-xl transition-colors shadow-sm"
              >
                Valider la commande
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
