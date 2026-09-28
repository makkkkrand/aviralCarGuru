package com.velora.carguru.repository;

import com.velora.carguru.document.EnquiryDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EnquiryRepository extends MongoRepository<EnquiryDocument, String> {
    Optional<EnquiryDocument> findByReferenceTicket(String referenceTicket);
}
