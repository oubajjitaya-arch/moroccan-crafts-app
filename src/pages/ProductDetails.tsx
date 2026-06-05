import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { products } from '../data/products';
import { ArrowLeft, ShoppingCart, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { calculateDynamicPrice } from '../utils/pricing';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  // Match id as string since id from URL is always a string
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <Navigate to="/" replace />;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const defaultImage = 'https://images.unsplash.com/photo-1510218830377-2e994ea9087d?auto=format&fit=crop&q=80&w=1000';

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-primary mb-8 font-medium transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour à la page d'accueil
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Image Column */}
            <div className="h-96 md:h-full min-h-[400px]">
              <img 
                src={product.image || defaultImage} 
                alt={product.title} 
                className="w-full h-full object-cover bg-gray-100"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Details Column */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                {product.title}
              </h1>
              
              <div className="flex flex-col mb-6">
                <div className="text-2xl font-bold text-primary">
                  Prix : {calculateDynamicPrice(product.price, product.stock ?? 0)} DH
                </div>
                {(product.stock ?? 0) <= 5 && (
                  <span className="text-sm text-primary/70 font-medium mt-1">Prix majoré (stock limité à {product.stock} unités)</span>
                )}
              </div>
              
              <div className="mb-6 flex items-center text-green-600 font-medium bg-green-50 w-fit px-4 py-2 rounded-full border border-green-100">
                <CheckCircle className="w-5 h-5 mr-2" />
                Quantité en stock : {product.stock}
              </div>
              
              <div className="prose prose-gray mb-10">
                <p className="text-gray-600 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center gap-6 mb-8">
                <span className="text-gray-700 font-medium">Quantité :</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-2 hover:bg-gray-50 text-gray-600 border-r border-gray-300 transition-colors focus:outline-none"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={product.stock}
                    className="w-16 text-center font-medium py-2 outline-none"
                  />
                  <button 
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="px-4 py-2 hover:bg-gray-50 text-gray-600 border-l border-gray-300 transition-colors focus:outline-none"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="mt-auto pt-8 border-t border-gray-100 flex gap-4">
                <button 
                  onClick={handleAddToCart}
                  className={`flex-1 font-medium py-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 ${
                    added 
                      ? 'bg-green-500 text-white' 
                      : 'bg-primary hover:bg-primary-hover text-white'
                  }`}
                >
                  {added ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Ajouté au panier !
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Ajouter au panier
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
