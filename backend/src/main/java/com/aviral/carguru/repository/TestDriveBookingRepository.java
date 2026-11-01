package com.aviral.carguru.repository;

import com.aviral.carguru.document.TestDriveBookingDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TestDriveBookingRepository extends MongoRepository<TestDriveBookingDocument, String> {

    Optional<TestDriveBookingDocument> findByConfirmationCodeIgnoreCase(String confirmationCode);

    default Optional<TestDriveBookingDocument> findByConfirmationCode(String confirmationCode) {
        return findByConfirmationCodeIgnoreCase(confirmationCode);
    }

    List<TestDriveBookingDocument> findByVehicleId(String vehicleId);

    List<TestDriveBookingDocument> findByStatus(String status);
}
