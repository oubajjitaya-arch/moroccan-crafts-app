import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { MapPin, ArrowLeft, Users, Star, MessageCircle, Phone } from 'lucide-react';
import { cities } from '../data/cities';

interface Artisan {
  id: string;
  name: string;
  craft: string;
  cityId: string;
  description: string;
  phone: string;
}

export default function CityDetails() {
  const { id } = useParams<{ id: string }>();
  const city = cities.find(c => c.id === id);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const res = await fetch('/api/artisans');
        const data = await res.json();
        // Filter artisans by this city
        const cityArtisans = data.filter((a: Artisan) => a.cityId === id);
        setArtisans(cityArtisans);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (city) {
      fetchArtisans();
    }
  }, [id, city]);

  if (!city) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        <img 
          src={city.image} 
          alt={city.name} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute top-6 left-6 z-10">
          <Link to="/" className="inline-flex items-center text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center text-primary-100 mb-3 font-medium">
              <MapPin className="w-5 h-5 mr-2 text-primary" />
              <span className="text-white/90 text-lg">{city.craft}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">{city.name}</h1>
            <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
              {city.description}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Left Column: Details */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">À propos de l'artisanat à {city.name}</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {city.details}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Spécialités locales</h3>
                <div className="flex flex-wrap gap-3">
                  {city.popularCrafts.map(craft => (
                    <span key={craft} className="bg-rose-50 text-primary px-4 py-2 rounded-full text-sm font-medium border border-rose-100">
                      {craft}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Stats & Actions */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{city.artisansCount}+</div>
                    <div className="text-sm text-gray-500">Artisans locaux</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">4.8/5</div>
                    <div className="text-sm text-gray-500">Note moyenne</div>
                  </div>
                </div>
              </div>

              <button className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm shadow-primary/20">
                <MessageCircle className="w-5 h-5" />
                Démarrer une discussion
              </button>
            </div>

          </div>
        </div>

        {/* Artisans Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Artisans à {city.name}</h2>
          {loading ? (
            <div className="flex justify-center p-8">
              <span className="text-gray-500">Chargement des artisans...</span>
            </div>
          ) : artisans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {artisans.map(artisan => (
                <div key={artisan.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{artisan.name}</h3>
                      <span className="inline-block bg-rose-50 text-primary text-xs font-semibold px-2 py-1 rounded mt-1">
                        {artisan.craft}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                    {artisan.description}
                  </p>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Phone className="w-4 h-4 mr-2" />
                    {artisan.phone || 'Non renseigné'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-500 mb-4">Aucun artisan n'est encore enregistré pour cette ville.</p>
              <Link to="/login?mode=register" className="text-primary hover:text-primary-hover font-medium">
                Vous êtes artisan ici ? Créez un compte.
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
