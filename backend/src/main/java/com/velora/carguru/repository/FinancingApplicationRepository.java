package com.velora.carguru.repository;

import com.velora.carguru.document.FinancingApplicationDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FinancingApplicationRepository extends MongoRepository<FinancingApplicationDocument, String> {
    Optional<FinancingApplicationDocument> findByReferenceNumber(String referenceNumber);
}
