import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
    setIsRegister(searchParams.get('mode') === 'register');
    setError('');
  }, [searchParams, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister ? { name, email, password, role } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">A</div>
          <h2 className="text-3xl font-bold text-gray-900">{isRegister ? 'Créer un compte' : 'Bon retour'}</h2>
          <p className="text-gray-500 mt-2">
            {isRegister 
              ? 'Rejoignez notre communauté d\'artisans et de passionnés' 
              : 'Connectez-vous pour accéder à votre espace'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">{error}</div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="Votre nom"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder="vous@exemple.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
              {!isRegister && (
                <a href="#" className="text-sm text-primary hover:text-primary-hover">Mot de passe oublié ?</a>
              )}
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Je suis un...</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
              >
                <option value="client">Client (Je cherche des artisans)</option>
                <option value="artisan">Artisan (Je propose mes services)</option>
              </select>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary/70 text-white font-medium py-3 rounded-md transition-colors flex justify-center items-center"
          >
            {loading ? 'Chargement...' : (isRegister ? 'S\'inscrire' : 'Se connecter')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          {isRegister ? (
            <p>
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">Se connecter</Link>
            </p>
          ) : (
            <p>
              Pas encore de compte ?{' '}
              <Link to="/login?mode=register" className="text-primary font-medium hover:underline">S'inscrire</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
