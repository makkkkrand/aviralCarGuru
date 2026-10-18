import React, { useState, useEffect } from 'react';
import { apiClient, VehicleSummary, VehicleFinanceProfile } from '../api/client';
import { formatINRLakhCrore, formatINR } from '../utils/formatters';
import { Search, Calculator, ArrowUpRight, Check, X, Info, ShieldCheck, MapPin, Zap, Truck, Car } from 'lucide-react';

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
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Vehicle Detail Modal
  const [activeVehicle, setActiveVehicle] = useState<VehicleSummary | null>(null);
  const [financeProfile, setFinanceProfile] = useState<VehicleFinanceProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, [searchQuery]);

  const fetchVehicles = () => {
    setLoading(true);
    apiClient.lookupVehicles(searchQuery)
      .then((res) => setVehicles(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const openVehicleDetails = async (v: VehicleSummary) => {
    setActiveVehicle(v);
    setLoadingProfile(true);
    try {
      const profile = await apiClient.getVehicleFinanceProfile(v.vehicleId);
      setFinanceProfile(profile);
    } catch {
      setFinanceProfile(null);
    } finally {
      setLoadingProfile(false);
    }
  };

  const categories = [
    { id: 'ALL', label: 'All Vehicles' },
    { id: 'SUV', label: 'SUVs & Sedans' },
    { id: 'EV', label: 'Electric Vehicles' },
    { id: 'PREOWNED', label: 'Certified Pre-Owned' },
    { id: 'LUXURY', label: 'Luxury & Performance' },
    { id: 'COMMERCIAL', label: 'Commercial Fleet' },
  ];

  const filteredVehicles = vehicles.filter((v) => {
    if (selectedCategory === 'ALL') return true;
    const cat = (v.category || '').toLowerCase();
    const mod = (v.model || '').toLowerCase();
    const make = (v.make || '').toLowerCase();

    if (selectedCategory === 'SUV') {
      return cat.includes('suv') || cat.includes('sedan') || mod.includes('suv');
    }
    if (selectedCategory === 'EV') {
      return cat.includes('electric') || mod.includes('ev') || mod.includes('taycan') || mod.includes('ioniq');
    }
    if (selectedCategory === 'PREOWNED') {
      return cat.includes('pre-owned') || make.includes('pre-owned');
    }
    if (selectedCategory === 'LUXURY') {
      return cat.includes('luxury') || cat.includes('tourer') || cat.includes('performance');
    }
    if (selectedCategory === 'COMMERCIAL') {
      return cat.includes('commercial') || cat.includes('fleet');
    }
    return true;
  });

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <div className="max-w-2xl mb-8">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
            CarGuru Pan-India Showcase
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Vehicles &amp; Automotive Fleet
          </h1>
          <p className="text-sm text-slate-600 leading-normal">
            Finance any vehicle with CarGuru: from family SUVs and electric crossovers to executive limousines, certified pre-owned cars, and commercial transport fleets.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search make, model, or category..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-colors"
            />
          </div>
        </div>

        {/* Vehicles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 rounded-xl bg-white border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="p-12 rounded-xl bg-white border border-slate-200 text-center max-w-md mx-auto my-8">
            <p className="text-slate-900 text-base font-semibold mb-1">No vehicles matched</p>
            <p className="text-slate-500 text-xs mb-4">Try clearing your search query or selecting All Vehicles.</p>
            <button
              onClick={() => { setSelectedCategory('ALL'); setSearchQuery(''); }}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((v) => (
              <div
                key={v.vehicleId}
                className="rounded-xl overflow-hidden bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Vehicle Image */}
                  <div className="relative aspect-video overflow-hidden bg-slate-100 cursor-pointer" onClick={() => openVehicleDetails(v)}>
                    <img
                      src={v.imageUrl}
                      alt={`${v.make} ${v.model}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded">
                      {v.category}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); openVehicleDetails(v); }}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-white/90 hover:bg-white text-slate-700 shadow-xs border border-slate-200 text-xs transition-colors"
                      title="View Financial Details"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <div className="text-xs text-slate-500 font-medium mb-1">
                      {v.year} · {v.make}
                    </div>

                    <h3 className="font-semibold text-lg text-slate-900 mb-0.5">
                      {v.model}
                    </h3>
                    <p className="text-xs text-slate-600 mb-4">{v.trim}</p>

                    <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                      <div>
                        <div className="text-[11px] font-medium text-slate-500 uppercase">Ex-Showroom Price</div>
                        <div className="text-lg font-bold text-slate-900 tabular-nums">
                          {formatINRLakhCrore(v.baseMSRP)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] font-medium text-slate-500 uppercase">Starting APR</div>
                        <div className="text-sm font-semibold text-emerald-700 tabular-nums">8.49% p.a.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex gap-2">
                  <button
                    onClick={() => onSelectVehicleForFinancing(v)}
                    className="flex-1 py-2 px-3 bg-slate-900 text-white hover:bg-slate-800 font-medium text-xs rounded-lg transition-colors text-center shadow-xs"
                  >
                    Calculate EMI
                  </button>
                  <button
                    onClick={() => onBookTestDrive(v.vehicleId)}
                    className="py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-xs rounded-lg transition-colors"
                  >
                    Test Drive
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Vehicle Financial Profile Modal */}
      {activeVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-xl p-6 rounded-xl border border-slate-200 bg-white shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveVehicle(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-5">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                CarGuru Vehicle Finance Profile
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
              </h2>
              <p className="text-xs text-slate-600">{activeVehicle.trim} · {activeVehicle.category}</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Ex-Showroom Price (INR)</div>
                  <div className="text-lg font-bold text-slate-900 tabular-nums">
                    {formatINR(activeVehicle.baseMSRP)}
                  </div>
                  <div className="text-xs text-slate-500">
                    ({formatINRLakhCrore(activeVehicle.baseMSRP)})
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Lending Benchmark</div>
                  <div className="text-lg font-bold text-emerald-700 tabular-nums">8.49% p.a.</div>
                  <div className="text-xs text-slate-500">Tier-1 Private Bank Loan</div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Indicative 20% Down Payment</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {formatINR(activeVehicle.baseMSRP * 0.20)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Indicative 60-Month EMI</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {formatINR(Math.round(activeVehicle.baseMSRP * 0.0205))} / mo
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Pan-India Registration &amp; RTO</span>
                  <span className="font-semibold text-slate-900">Assisted in all 28 states</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600 font-medium">CarGuru Consultation</span>
                  <span className="font-semibold text-emerald-700">Free Doorstep Advisory Included</span>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  onClick={() => {
                    const v = activeVehicle;
                    setActiveVehicle(null);
                    onSelectVehicleForFinancing(v);
                  }}
                  className="flex-1 py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-800 font-medium text-xs rounded-lg transition-colors text-center shadow-xs"
                >
                  Configure in EMI Calculator
                </button>
                <button
                  onClick={() => {
                    const id = activeVehicle.vehicleId;
                    setActiveVehicle(null);
                    onBookTestDrive(id);
                  }}
                  className="py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-xs rounded-lg transition-colors"
                >
                  Book Test Drive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
