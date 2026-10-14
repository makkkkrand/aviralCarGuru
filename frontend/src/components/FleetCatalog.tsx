import React, { useState, useEffect } from 'react';
import { apiClient, VehicleSummary } from '../api/client';
import { 
  Compass, 
  Calculator, 
  ArrowRight, 
  Gauge, 
  Search, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  SlidersHorizontal 
} from 'lucide-react';

interface FleetCatalogProps {
  onSelectVehicleForFinancing: (vehicle: VehicleSummary) => void;
  onBookTestDrive: (vehicleId: string) => void;
}

export const FleetCatalog: React.FC<FleetCatalogProps> = ({
  onSelectVehicleForFinancing,
  onBookTestDrive,
}) => {
  const [vehicles, setVehicles] = useState<VehicleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    apiClient.lookupVehicles()
      .then((res) => setVehicles(res))
      .catch((err) => console.error('Failed to load fleet catalog', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['ALL', 'COUPE', 'SEDAN', 'SUV', 'ELECTRIC', 'CONVERTIBLE'];

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = 
      v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.trim.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      selectedCategory === 'ALL' || 
      v.category?.toUpperCase() === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section id="fleet-showcase" className="py-20 relative">
      {/* Background Subtle Ambience */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-600/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Curated Performance Collection</span>
            </div>
            <h2 className="heading-hero text-4xl sm:text-5xl lg:text-6xl text-white">
              OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">FLEET</span>
            </h2>
            <p className="text-slate-400 max-w-xl text-sm sm:text-base mt-2">
              Every vehicle in our showroom undergoes a 180-point technical inspection and qualifies for subsidized 3.99% Velora luxury rates.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center space-x-6 p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md self-start lg:self-end">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">In Inventory</span>
              <span className="text-xl font-display font-bold text-white">{vehicles.length} Models</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">Delivery</span>
              <span className="text-xl font-display font-bold text-cyan-400">48-72h</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="glass-panel p-4 rounded-2xl mb-10 flex flex-col md:flex-row items-center justify-between gap-4 border-white/10 bg-[#090d19]/80">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search make, model, trim..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>
        </div>

        {/* Vehicles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-panel h-96 rounded-3xl animate-pulse bg-white/5 border-white/10" />
            ))}
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl border-white/10">
            <SlidersHorizontal className="w-12 h-12 text-cyan-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2">No matching vehicles found</h3>
            <p className="text-slate-400 text-sm mb-6">Try clearing your filters or searching for another performance model.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
              }}
              className="btn-pill btn-outline text-xs px-6 py-2.5"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((v) => (
              <div
                key={v.vehicleId}
                className="glass-panel rounded-3xl overflow-hidden group border-white/10 flex flex-col justify-between hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-950/40 transition-all duration-300 bg-[#090e1a]/90"
              >
                <div>
                  {/* Vehicle Image Container */}
                  <div className="relative h-64 overflow-hidden bg-slate-950">
                    <img
                      src={v.imageUrl}
                      alt={`${v.make} ${v.model}`}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090e1a] via-transparent to-black/30" />
                    
                    {/* Category & Status Badges */}
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[11px] font-bold text-cyan-400 uppercase tracking-wider border border-white/10">
                        {v.category}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold tracking-wider border border-emerald-500/30 backdrop-blur-md">
                        IN STOCK
                      </span>
                    </div>
                  </div>

                  {/* Vehicle Metadata & Pricing */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                        {v.year} {v.make}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">VIN: {v.vehicleId.slice(-6)}</span>
                    </div>

                    <h3 className="text-2xl font-display font-black text-white mb-1 group-hover:text-cyan-300 transition-colors">
                      {v.model}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mb-6">{v.trim}</p>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-baseline justify-between mb-6">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">Starting MSRP</span>
                        <span className="text-2xl font-black text-white font-display">
                          ${v.baseMSRP.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">Est. Luxury Finance</span>
                        <span className="text-base font-extrabold text-cyan-400 font-mono">
                          ~${Math.round(v.baseMSRP * 0.016).toLocaleString()}<span className="text-xs font-normal text-slate-400">/mo</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-6 pt-0 flex gap-2.5">
                  <button
                    onClick={() => onSelectVehicleForFinancing(v)}
                    className="btn-pill btn-cyan flex-1 py-3 text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Configure Loan</span>
                  </button>
                  <button
                    onClick={() => onBookTestDrive(v.vehicleId)}
                    className="btn-pill btn-outline py-3 px-4 text-xs font-bold border-white/15 hover:border-cyan-400"
                  >
                    Test Drive
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
