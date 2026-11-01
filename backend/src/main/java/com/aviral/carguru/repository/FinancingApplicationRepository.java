package com.aviral.carguru.repository;

import com.aviral.carguru.document.ApplicationStatus;
import com.aviral.carguru.document.FinancingApplicationDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FinancingApplicationRepository extends MongoRepository<FinancingApplicationDocument, String>, FinancingApplicationCustomRepository {

    Optional<FinancingApplicationDocument> findByReferenceNumberIgnoreCase(String referenceNumber);

    default Optional<FinancingApplicationDocument> findByReferenceNumber(String referenceNumber) {
        return findByReferenceNumberIgnoreCase(referenceNumber);
    }

    List<FinancingApplicationDocument> findByStatus(ApplicationStatus status);

    default List<FinancingApplicationDocument> findByStatus(String status) {
        if (status == null || status.isBlank()) {
            return List.of();
        }
        return findByStatus(ApplicationStatus.fromString(status));
    }

    List<FinancingApplicationDocument> findByApplicantEmail(String email);
}
