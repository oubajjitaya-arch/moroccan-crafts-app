import React from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cities } from '../data/cities';

export default function Villes() {
  return (
    <div className="pt-12 pb-24 max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <p className="text-primary font-bold tracking-widest text-sm uppercase mb-3">Destinations</p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Toutes les Villes Artisanales</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Découvrez l'ensemble de nos villes partenaires. Cliquez sur une ville pour explorer son histoire, ses spécialités et contacter ses artisans.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {cities.map((city) => (
          <Link to={`/ville/${city.id}`} key={city.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="relative h-72 overflow-hidden">
              <img src={city.image} alt={city.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-3xl font-bold text-white mb-2">{city.name}</h3>
                <div className="flex items-center text-white/90 font-medium">
                  <MapPin className="w-5 h-5 mr-2 text-primary" />
                  {city.craft}
                </div>
              </div>
            </div>
            <div className="p-8 flex flex-col flex-grow">
              <p className="text-gray-600 leading-relaxed mb-8 flex-grow">{city.description}</p>
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                <div className="text-sm font-medium text-gray-500">
                  <span className="text-gray-900 font-bold">{city.artisansCount}</span> artisans
                </div>
                <span className="inline-flex items-center text-primary font-medium group-hover:text-primary-hover transition-colors group/link">
                  Découvrir la ville
                  <ChevronRight className="w-5 h-5 ml-1 group-hover/link:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
