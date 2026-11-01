package com.aviral.carguru.repository;

import com.aviral.carguru.document.EnquiryDocument;
import com.aviral.carguru.document.EnquiryStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnquiryRepository extends MongoRepository<EnquiryDocument, String> {

    Optional<EnquiryDocument> findByReferenceTicketIgnoreCase(String referenceTicket);

    default Optional<EnquiryDocument> findByReferenceTicket(String referenceTicket) {
        return findByReferenceTicketIgnoreCase(referenceTicket);
    }

    List<EnquiryDocument> findByStatus(EnquiryStatus status);

    default List<EnquiryDocument> findByStatus(String status) {
        if (status == null || status.isBlank()) {
            return List.of();
        }
        return findByStatus(EnquiryStatus.fromString(status));
    }

    List<EnquiryDocument> findByEnquiryType(String enquiryType);

    List<EnquiryDocument> findByStatusAndEnquiryType(EnquiryStatus status, String enquiryType);

    default List<EnquiryDocument> findByStatusAndEnquiryType(String status, String enquiryType) {
        return findByStatusAndEnquiryType(EnquiryStatus.fromString(status), enquiryType);
    }
}
