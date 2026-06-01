import React from 'react';
import { Search, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cities } from '../data/cities';

function Hero() {
  return (
    <section className="relative pt-24 pb-32 px-4 text-center overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e63946' fill-opacity='1'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-rose-50/50 via-white to-white" />

      <div className="max-w-4xl mx-auto">
        <p className="text-primary font-bold tracking-widest text-sm uppercase mb-6">
          Patrimoine & Tradition
        </p>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
          Découvrez l'Artisanat Traditionnel <br className="hidden md:block" />
          dans les Villes Marocaines
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Explorez les villes du Maroc connues pour leurs artisans ancestraux 
          et connectez-vous directement avec les artisans locaux.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/villes" className="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-md font-medium text-lg transition-colors w-full sm:w-auto">
            Voir toutes les villes
          </Link>
          <Link to="/login?mode=register" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3.5 rounded-md font-medium text-lg transition-colors w-full sm:w-auto">
            S'inscrire
          </Link>
        </div>
      </div>
    </section>
  );
}

function SearchSection() {
  return (
    <section className="max-w-4xl mx-auto px-4 -mt-16 relative z-10 mb-24">
      <div className="bg-white p-2 rounded-lg shadow-xl shadow-red-900/5 flex flex-col md:flex-row items-center gap-2 border border-gray-100">
        <div className="flex-1 flex items-center px-4 py-3 w-full">
          <Search className="text-gray-400 w-5 h-5 mr-3" />
          <input 
            type="text" 
            placeholder="Rechercher par ville ou artisanat..." 
            className="w-full outline-none text-gray-700 text-lg bg-transparent"
          />
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-md font-medium transition-colors w-full md:w-auto whitespace-nowrap">
          Rechercher
        </button>
      </div>
      
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
        <span className="font-medium">Populaires:</span>
        {['Fès', 'Marrakech', 'Safi', 'Tétouan'].map((city) => (
          <Link key={city} to={`/ville/${city.toLowerCase().replace('è', 'e').replace('é', 'e')}`} className="hover:text-primary border-b-2 border-transparent hover:border-primary pb-0.5 transition-all">
            {city}
          </Link>
        ))}
      </div>
    </section>
  );
}

function CitiesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 mb-20">
      <div className="text-center mb-16">
        <p className="text-primary font-bold tracking-widest text-sm uppercase mb-3">
          Explorer
        </p>
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Villes Artisanales</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Chaque ville marocaine possède son propre héritage artisanal unique, 
          transmis de génération en génération.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cities.map((city) => (
          <Link to="/villes" key={city.id} className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="relative h-64 overflow-hidden">
              <img 
                src={city.image} 
                alt={city.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-2xl font-bold text-white mb-2">{city.name}</h3>
                <div className="flex items-center text-white/90 text-sm font-medium">
                  <MapPin className="w-4 h-4 mr-1 text-primary" />
                  {city.craft}
                </div>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">{city.description}</p>
              <span className="inline-flex items-center text-primary font-medium group-hover:text-primary-hover transition-colors group/link">
                Voir toutes les villes
                <ChevronRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link to="/villes" className="inline-flex items-center text-gray-600 font-medium hover:text-primary transition-colors">
          Voir toutes les villes <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <SearchSection />
      <CitiesSection />
    </>
  );
}
