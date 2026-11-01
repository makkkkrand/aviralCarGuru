package com.aviral.carguru.service;

import com.aviral.carguru.document.EnquiryDocument;
import com.aviral.carguru.document.EnquiryStatus;
import com.aviral.carguru.document.TestDriveBookingDocument;
import com.aviral.carguru.model.*;
import com.aviral.carguru.repository.EnquiryRepository;
import com.aviral.carguru.repository.TestDriveBookingRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;

@Service
public class EnquiryService {

    private final EnquiryRepository enquiryRepository;
    private final TestDriveBookingRepository testDriveBookingRepository;

    public EnquiryService(EnquiryRepository enquiryRepository, TestDriveBookingRepository testDriveBookingRepository) {
        this.enquiryRepository = enquiryRepository;
        this.testDriveBookingRepository = testDriveBookingRepository;
    }

    public EnquiryResponse createEnquiry(CreateEnquiryRequest request) {
        EnquiryDocument doc = new EnquiryDocument();
        String ticket = "VEL-ENQ-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        doc.setReferenceTicket(ticket);
        doc.setEnquiryType(request.getEnquiryType().getValue());
        doc.setStatus(EnquiryStatus.NEW);
        doc.setCustomer(request.getCustomer());
        doc.setVehicleReference(request.getVehicleReference());
        doc.setPreferredTimeSlot(request.getPreferredTimeSlot() != null ? request.getPreferredTimeSlot().getValue() : "ANYTIME");
        doc.setPostalCode(request.getPostalCode());
        doc.setMessage(request.getMessage());
        Instant now = Instant.now();
        doc.setCreatedAt(now);
        doc.setUpdatedAt(now);

        EnquiryDocument saved = enquiryRepository.save(doc);

        EnquiryResponse response = new EnquiryResponse();
        response.setEnquiryId(saved.getId());
        response.setReferenceTicket(saved.getReferenceTicket());
        response.setStatus(EnquiryResponse.StatusEnum.NEW);
        response.setCreatedAt(saved.getCreatedAtAsOffsetDateTime());
        return response;
    }

    public EnquiriesListResponse listEnquiries(String status, String type) {
        List<EnquiryDocument> docs;

        boolean hasStatus = status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status);
        boolean hasType = type != null && !type.isBlank() && !"ALL".equalsIgnoreCase(type);

        if (hasStatus && hasType) {
            docs = enquiryRepository.findByStatusAndEnquiryType(status.toUpperCase(), type.toUpperCase());
        } else if (hasStatus) {
            docs = enquiryRepository.findByStatus(status.toUpperCase());
        } else if (hasType) {
            docs = enquiryRepository.findByEnquiryType(type.toUpperCase());
        } else {
            docs = enquiryRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        }

        List<EnquiryDetail> details = docs.stream().map(this::mapToDetail).toList();

        EnquiriesListResponse response = new EnquiriesListResponse();
        response.setTotalCount(details.size());
        response.setTotal(details.size());
        response.setEnquiries(details);
        return response;
    }

    public Optional<EnquiryDetail> getEnquiryById(String enquiryId) {
        return findEnquiryByIdOrTicket(enquiryId).map(this::mapToDetail);
    }

    public Optional<EnquiryDetail> updateEnquiry(String enquiryId, UpdateEnquiryRequest request) {
        Optional<EnquiryDocument> opt = findEnquiryByIdOrTicket(enquiryId);
        if (opt.isEmpty()) {
            return Optional.empty();
        }

        EnquiryDocument doc = opt.get();
        doc.setUpdatedAt(Instant.now());

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            doc.setStatus(request.getStatus().toUpperCase());
        }

        if (request.getAssignedAdvisor() != null && !request.getAssignedAdvisor().isBlank()) {
            doc.setAssignedAdvisor(request.getAssignedAdvisor());
        }

        if (request.getResolutionNote() != null && !request.getResolutionNote().isBlank()) {
            if (doc.getResolutionNotes() == null) {
                doc.setResolutionNotes(new ArrayList<>());
            }
            doc.getResolutionNotes().add(request.getResolutionNote());
        }

        EnquiryDocument saved = enquiryRepository.save(doc);
        return Optional.of(mapToDetail(saved));
    }

    public List<TestDriveBookingDetail> listTestDrives() {
        List<TestDriveBookingDocument> list = testDriveBookingRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return list.stream().map(TestDriveBookingDocument::toDetail).toList();
    }

    public Optional<TestDriveBookingDetail> updateTestDrive(String bookingId, UpdateTestDriveRequest request) {
        Optional<TestDriveBookingDocument> opt = findTestDriveByIdOrCode(bookingId);
        if (opt.isEmpty()) {
            return Optional.empty();
        }

        TestDriveBookingDocument doc = opt.get();

        if (request.getStatus() != null) {
            String statusStr = request.getStatus().getValue();
            doc.setStatus(statusStr.toUpperCase());
        }

        if (request.getDealershipLocation() != null && !request.getDealershipLocation().isBlank()) {
            doc.setDealershipLocation(request.getDealershipLocation());
        }

        if (request.getNotes() != null && !request.getNotes().isBlank()) {
            String existingNotes = doc.getNotes() != null ? doc.getNotes() + " | " : "";
            doc.setNotes(existingNotes + request.getNotes());
        }

        TestDriveBookingDocument saved = testDriveBookingRepository.save(doc);
        return Optional.of(saved.toDetail());
    }

    public EnquiryCategoriesResponse getEnquiryCategories() {
        EnquiryCategoriesResponse res = new EnquiryCategoriesResponse();
        res.setCategories(List.of(
                "GENERAL",
                "VEHICLE_AVAILABILITY",
                "PRICE_QUOTE",
                "FINANCE_ASSISTANCE",
                "TRADE_IN"
        ));
        res.setContactMethods(List.of("EMAIL", "PHONE", "WHATSAPP", "SMS"));
        res.setTimeSlots(List.of("MORNING", "AFTERNOON", "EVENING", "ANYTIME"));
        return res;
    }

    public TestDriveBookingResponse bookTestDrive(TestDriveBookingRequest request) {
        TestDriveBookingDocument doc = new TestDriveBookingDocument();
        String code = "VEL-DRIVE-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        doc.setConfirmationCode(code);
        doc.setCustomer(request.getCustomer());
        doc.setVehicleId(request.getVehicleId());
        String location = request.getDealershipLocation() != null && !request.getDealershipLocation().isBlank()
                ? request.getDealershipLocation()
                : "Velora Flagship Experience Center";
        doc.setDealershipLocation(location);
        doc.setPreferredDate(request.getPreferredDate());
        doc.setPreferredTimeSlot(request.getPreferredTimeSlot().getValue());
        doc.setDriverLicenseValid(Boolean.TRUE.equals(request.getDriverLicenseValid()));
        doc.setNotes(request.getNotes());
        doc.setStatus("CONFIRMED");

        OffsetDateTime scheduled = request.getPreferredDate().atTime(14, 0).atOffset(ZoneOffset.UTC);
        doc.setScheduledDateTime(scheduled);
        doc.setCreatedAt(Instant.now());

        testDriveBookingRepository.save(doc);

        TestDriveBookingResponse res = new TestDriveBookingResponse();
        res.setBookingId(doc.getId());
        res.setConfirmationCode(doc.getConfirmationCode());
        res.setStatus(TestDriveBookingResponse.StatusEnum.CONFIRMED);
        res.setScheduledDateTime(scheduled);
        res.setDealershipLocation(location);
        return res;
    }

    public Optional<EnquiryResponse> cancelEnquiry(String enquiryId, CancelEnquiryRequest request) {
        Optional<EnquiryDocument> opt = findEnquiryByIdOrTicket(enquiryId);
        if (opt.isEmpty()) {
            return Optional.empty();
        }

        EnquiryDocument doc = opt.get();
        doc.setStatus(EnquiryStatus.CANCELLED);
        doc.setUpdatedAt(Instant.now());
        if (doc.getResolutionNotes() == null) {
            doc.setResolutionNotes(new ArrayList<>());
        }
        doc.getResolutionNotes().add("Cancelled: " + request.getReason());

        enquiryRepository.save(doc);

        EnquiryResponse response = new EnquiryResponse();
        response.setEnquiryId(doc.getId());
        response.setReferenceTicket(doc.getReferenceTicket());
        response.setStatus(EnquiryResponse.StatusEnum.CANCELLED);
        response.setCreatedAt(doc.getCreatedAtAsOffsetDateTime());
        return Optional.of(response);
    }

    private Optional<EnquiryDocument> findEnquiryByIdOrTicket(String identifier) {
        if (identifier == null || identifier.isBlank()) {
            return Optional.empty();
        }
        Optional<EnquiryDocument> opt = enquiryRepository.findById(identifier);
        if (opt.isEmpty()) {
            opt = enquiryRepository.findByReferenceTicketIgnoreCase(identifier);
        }
        return opt;
    }

    private Optional<TestDriveBookingDocument> findTestDriveByIdOrCode(String identifier) {
        if (identifier == null || identifier.isBlank()) {
            return Optional.empty();
        }
        Optional<TestDriveBookingDocument> opt = testDriveBookingRepository.findById(identifier);
        if (opt.isEmpty()) {
            opt = testDriveBookingRepository.findByConfirmationCodeIgnoreCase(identifier);
        }
        return opt;
    }

    private EnquiryDetail mapToDetail(EnquiryDocument d) {
        EnquiryDetail detail = new EnquiryDetail();
        detail.setEnquiryId(d.getId());
        detail.setReferenceTicket(d.getReferenceTicket());
        detail.setEnquiryType(d.getEnquiryType());
        detail.setStatus(d.getStatusValue());
        detail.setAssignedAdvisor(d.getAssignedAdvisor());
        detail.setCustomer(d.getCustomer());
        detail.setVehicleReference(d.getVehicleReference());
        detail.setPreferredTimeSlot(d.getPreferredTimeSlot());
        detail.setPostalCode(d.getPostalCode());
        detail.setMessage(d.getMessage());
        detail.setResolutionNotes(d.getResolutionNotes());
        detail.setCreatedAt(d.getCreatedAtAsOffsetDateTime());
        detail.setUpdatedAt(d.getUpdatedAtAsOffsetDateTime());
        return detail;
    }
}
