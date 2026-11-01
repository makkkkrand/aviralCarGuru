package com.aviral.carguru.document;

import com.aviral.carguru.model.VehicleApplicationDetails;

public class VehicleDetails extends VehicleApplicationDetails {

    public VehicleDetails() {
        super();
    }

    public VehicleDetails(VehicleApplicationDetails details) {
        super();
        if (details != null) {
            setVehicleId(details.getVehicleId());
            setVin(details.getVin());
            setMake(details.getMake());
            setModel(details.getModel());
            setYear(details.getYear());
            setTrim(details.getTrim());
            setPurchasePrice(details.getPurchasePrice());
        }
    }
}
