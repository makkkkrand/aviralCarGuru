package com.velora.carguru.service;

import com.velora.carguru.model.VehicleFinanceProfile;
import com.velora.carguru.model.VehicleSummary;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CatalogService {

    private final List<VehicleSummary> fleet = new ArrayList<>();

    public CatalogService() {
        initFleet();
    }

    private void initFleet() {
        VehicleSummary v1 = new VehicleSummary();
        v1.setVehicleId("VEL-2026-GT");
        v1.setMake("Mercedes-AMG");
        v1.setModel("GT 4-Door Coupe");
        v1.setYear(2026);
        v1.setTrim("63 S E Performance");
        v1.setBaseMSRP(98500.0);
        v1.setCategory("Luxury Grand Tourer");
        v1.setImageUrl("https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80");
        fleet.add(v1);

        VehicleSummary v2 = new VehicleSummary();
        v2.setVehicleId("VEL-2026-TAYCAN");
        v2.setMake("Porsche");
        v2.setModel("Taycan");
        v2.setYear(2026);
        v2.setTrim("Turbo S Cross Turismo");
        v2.setBaseMSRP(112000.0);
        v2.setCategory("Electric Performance");
        v2.setImageUrl("https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80");
        fleet.add(v2);

        VehicleSummary v3 = new VehicleSummary();
        v3.setVehicleId("VEL-2026-RSETRON");
        v3.setMake("Audi");
        v3.setModel("RS e-tron GT");
        v3.setYear(2026);
        v3.setTrim("Performance Edition");
        v3.setBaseMSRP(106500.0);
        v3.setCategory("Luxury Grand Tourer");
        v3.setImageUrl("https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80");
        fleet.add(v3);

        VehicleSummary v4 = new VehicleSummary();
        v4.setVehicleId("VEL-2026-M8");
        v4.setMake("BMW");
        v4.setModel("M8 Competition");
        v4.setYear(2026);
        v4.setTrim("Gran Coupe");
        v4.setBaseMSRP(138800.0);
        v4.setCategory("High-Performance Sedan");
        v4.setImageUrl("https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80");
        fleet.add(v4);

        VehicleSummary v5 = new VehicleSummary();
        v5.setVehicleId("VEL-2026-DB12");
        v5.setMake("Aston Martin");
        v5.setModel("DB12");
        v5.setYear(2026);
        v5.setTrim("Super Tourer");
        v5.setBaseMSRP(248000.0);
        v5.setCategory("Super Tourer");
        v5.setImageUrl("https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80");
        fleet.add(v5);
    }

    public List<VehicleSummary> lookupVehicles(String query, String make, Integer limit) {
        int max = (limit != null && limit > 0) ? limit : 10;
        return fleet.stream()
                .filter(v -> {
                    if (make != null && !make.isBlank() && !v.getMake().equalsIgnoreCase(make)) {
                        return false;
                    }
                    if (query != null && !query.isBlank()) {
                        String q = query.toLowerCase();
                        return v.getMake().toLowerCase().contains(q) ||
                                v.getModel().toLowerCase().contains(q) ||
                                v.getTrim().toLowerCase().contains(q);
                    }
                    return true;
                })
                .limit(max)
                .collect(Collectors.toList());
    }

    public Optional<VehicleFinanceProfile> getFinanceProfile(String vehicleId) {
        return fleet.stream()
                .filter(v -> v.getVehicleId().equalsIgnoreCase(vehicleId))
                .findFirst()
                .map(v -> {
                    VehicleFinanceProfile profile = new VehicleFinanceProfile();
                    profile.setVehicleId(v.getVehicleId());
                    profile.setBaseMSRP(v.getBaseMSRP());
                    profile.setEligibleAprStarting(3.99);
                    profile.setMaxTenureMonths(72);
                    double estLease = Math.round((v.getBaseMSRP() * 0.0125) * 100.0) / 100.0;
                    profile.setEstimatedMonthlyLease(estLease);
                    profile.setAvailableIncentives(List.of(
                            "$2,500 Velora Luxury Loyalty Credit",
                            "Special 3.99% APR Financing for up to 60 Months",
                            "Complimentary 3-Year Scheduled Performance Maintenance"
                    ));
                    return profile;
                });
    }
}
