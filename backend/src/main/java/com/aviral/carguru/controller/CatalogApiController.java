package com.aviral.carguru.controller;

import com.aviral.carguru.api.CatalogApi;
import com.aviral.carguru.model.VehicleFinanceProfile;
import com.aviral.carguru.model.VehicleSummary;
import com.aviral.carguru.service.CatalogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CatalogApiController implements CatalogApi {

    private final CatalogService catalogService;

    public CatalogApiController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @Override
    public ResponseEntity<List<VehicleSummary>> lookupVehicles(String query, String make, Integer limit) {
        List<VehicleSummary> results = catalogService.lookupVehicles(query, make, limit);
        return ResponseEntity.ok(results);
    }

    @Override
    public ResponseEntity<VehicleFinanceProfile> getVehicleFinanceProfile(String vehicleId) {
        return catalogService.getFinanceProfile(vehicleId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
