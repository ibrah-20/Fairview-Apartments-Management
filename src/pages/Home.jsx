import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Building, ShieldCheck, Activity } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-surface-dark py-24 px-6 text-center text-white border-b border-surface-hover-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-maroon-dark/80 via-surface-dark to-maroon-dark/80 z-0" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-xs text-silver-dark tracking-[0.3em] mb-4 uppercase font-bold">Welcome to</div>
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-silver-dark">
            CITY LAKE ENTERPRISES
          </h1>
          <div className="w-24 h-1 bg-maroon mx-auto mb-8 rounded-full" />
          <p className="text-xl md:text-2xl text-silver mb-10 font-light max-w-2xl mx-auto leading-relaxed">
            Integrating premium real estate management with advanced water purification systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking" className="btn-primary py-3 px-8 text-lg shadow-xl shadow-maroon/30 hover:-translate-y-1 transform transition-all">
              Book Apartment
            </Link>
            <Link to="/water" className="btn-secondary py-3 px-8 text-lg border-none bg-surface-hover-dark text-white hover:bg-surface-hover-dark/80 hover:-translate-y-1 transform transition-all flex items-center justify-center gap-2">
              <Droplets size={20} /> Water Services
            </Link>
          </div>
        </div>
      </div>

      {/* Divisions Section */}
      <div className="max-w-7xl mx-auto py-20 px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-heading font-bold text-text-light dark:text-text-dark mb-4">Our Divisions</h2>
          <p className="text-text-muted-light dark:text-text-muted-dark">Managing quality of life through real estate and clean water.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Fairview Apartments */}
          <div className="enterprise-card p-10 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-maroon/10 dark:bg-maroon/20 rounded-2xl flex items-center justify-center mb-6 text-maroon dark:text-maroon-light">
              <Building size={32} />
            </div>
            <h3 className="text-2xl font-heading font-bold mb-4 text-text-light dark:text-text-dark">Fairview Apartments</h3>
            <p className="text-text-muted-light dark:text-text-muted-dark mb-8 leading-relaxed">
              Premium 90-unit residential complex offering modern amenities, top-tier security, and a vibrant community in the heart of the city.
            </p>
            <ul className="space-y-3 mb-8 text-sm text-text-light dark:text-text-dark font-medium">
              <li className="flex items-center gap-3"><ShieldCheck className="text-maroon" size={18} /> 24/7 Security & CCTV</li>
              <li className="flex items-center gap-3"><Activity className="text-maroon" size={18} /> Dedicated Maintenance Team</li>
              <li className="flex items-center gap-3"><Droplets className="text-maroon" size={18} /> Guaranteed Water Supply</li>
            </ul>
            <Link to="/rooms" className="text-maroon dark:text-maroon-light font-bold hover:underline flex items-center gap-1">
              Explore Units <span className="text-xl">→</span>
            </Link>
          </div>

          {/* City Lake Water Refill */}
          <div className="enterprise-card p-10 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
              <Droplets size={32} />
            </div>
            <h3 className="text-2xl font-heading font-bold mb-4 text-text-light dark:text-text-dark">City Lake Water Station</h3>
            <p className="text-text-muted-light dark:text-text-muted-dark mb-8 leading-relaxed">
              Advanced reverse osmosis water purification station providing affordable, crystal-clear drinking water to residents and the public.
            </p>
            <ul className="space-y-3 mb-8 text-sm text-text-light dark:text-text-dark font-medium">
              <li className="flex items-center gap-3"><ShieldCheck className="text-blue-500" size={18} /> 6-Stage Filtration</li>
              <li className="flex items-center gap-3"><Activity className="text-blue-500" size={18} /> Daily Quality Testing</li>
              <li className="flex items-center gap-3"><Droplets className="text-blue-500" size={18} /> 10L and 20L Refills</li>
            </ul>
            <Link to="/water" className="text-blue-500 font-bold hover:underline flex items-center gap-1">
              Order Water <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-surface-light dark:bg-surface-dark border-t border-silver-light dark:border-surface-hover-dark py-12 px-6 text-center">
        <h2 className="text-2xl font-heading font-bold text-text-light dark:text-text-dark mb-2">City Lake Enterprises</h2>
        <p className="text-text-muted-light dark:text-text-muted-dark mb-8">Elevating everyday living.</p>
        <div className="text-sm text-text-muted-light dark:text-text-muted-dark font-medium">
          © 2026 City Lake Enterprises. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
