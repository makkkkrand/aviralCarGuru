import React, { useState, useEffect } from 'react';
import { apiClient, VehicleSummary } from '../api/client';
import { Compass, Calculator, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

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

  useEffect(() => {
    apiClient.lookupVehicles()
      .then((res) => setVehicles(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="fleet-showcase" className="py-16">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Curated Performance Collection</span>
            </div>
            <h2 className="heading-hero text-4xl sm:text-5xl lg:text-6xl text-white">
              OUR <span className="text-cyan-400">FLEET</span>
            </h2>
          </div>
          <p className="text-slate-400 max-w-md text-sm sm:text-base">
            Every vehicle in our collection is backed by factory certified inspection and eligible for subsidized 3.99% Velora luxury rates.
          </p>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((v) => (
            <div
              key={v.vehicleId}
              className="glass-panel rounded-3xl overflow-hidden group border-white/10 flex flex-col justify-between hover:border-cyan-500/40"
            >
              <div>
                {/* Vehicle Image */}
                <div className="relative h-60 overflow-hidden bg-slate-900">
                  <img
                    src={v.imageUrl}
                    alt={`${v.make} ${v.model}`}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060911] via-transparent to-black/20" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-semibold text-cyan-400 uppercase tracking-wider border border-white/10">
                    {v.category}
                  </span>
                </div>

                {/* Details */}
                <div className="p-6">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                    {v.year} {v.make}
                  </span>
                  <h3 className="text-2xl font-display font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                    {v.model}
                  </h3>
                  <span className="text-xs text-slate-400 block mb-4 font-mono">{v.trim}</span>

                  <div className="flex items-baseline justify-between py-3 border-y border-white/10 mb-4">
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase block">Starting MSRP</span>
                      <span className="text-xl font-extrabold text-white font-display">
                        ${v.baseMSRP.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 uppercase block">Est. Finance</span>
                      <span className="text-base font-bold text-cyan-400 font-mono">
                        ~${Math.round(v.baseMSRP * 0.016).toLocaleString()}/mo
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 flex gap-2">
                <button
                  onClick={() => onSelectVehicleForFinancing(v)}
                  className="btn-pill btn-cyan flex-1 py-2.5 text-xs font-bold flex items-center justify-center space-x-1.5"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Finance This Car</span>
                </button>
                <button
                  onClick={() => onBookTestDrive(v.vehicleId)}
                  className="btn-pill btn-outline py-2.5 px-4 text-xs font-semibold"
                >
                  Test Drive
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
