package com.velora.carguru.service;

import com.velora.carguru.document.EnquiryDocument;
import com.velora.carguru.document.TestDriveBookingDocument;
import com.velora.carguru.model.*;
import com.velora.carguru.repository.EnquiryRepository;
import com.velora.carguru.repository.TestDriveBookingRepository;
import org.springframework.stereotype.Service;

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
        doc.setStatus("NEW");
        doc.setCustomer(request.getCustomer());
        doc.setVehicleReference(request.getVehicleReference());
        doc.setPreferredTimeSlot(request.getPreferredTimeSlot() != null ? request.getPreferredTimeSlot().getValue() : "ANYTIME");
        doc.setPostalCode(request.getPostalCode());
        doc.setMessage(request.getMessage());
        doc.setCreatedAt(OffsetDateTime.now());
        doc.setUpdatedAt(OffsetDateTime.now());

        EnquiryDocument saved = enquiryRepository.save(doc);

        EnquiryResponse response = new EnquiryResponse();
        response.setEnquiryId(saved.getId());
        response.setReferenceTicket(saved.getReferenceTicket());
        response.setStatus(EnquiryResponse.StatusEnum.NEW);
        response.setCreatedAt(saved.getCreatedAt());
        return response;
    }

    public Optional<EnquiryDetail> getEnquiryById(String enquiryId) {
        Optional<EnquiryDocument> opt = enquiryRepository.findById(enquiryId);
        if (opt.isEmpty()) {
            opt = enquiryRepository.findByReferenceTicket(enquiryId);
        }

        return opt.map(d -> {
            EnquiryDetail detail = new EnquiryDetail();
            detail.setEnquiryId(d.getId());
            detail.setReferenceTicket(d.getReferenceTicket());
            detail.setEnquiryType(d.getEnquiryType());
            detail.setStatus(d.getStatus());
            detail.setCustomer(d.getCustomer());
            detail.setVehicleReference(d.getVehicleReference());
            detail.setPreferredTimeSlot(d.getPreferredTimeSlot());
            detail.setPostalCode(d.getPostalCode());
            detail.setMessage(d.getMessage());
            detail.setCreatedAt(d.getCreatedAt());
            detail.setUpdatedAt(d.getUpdatedAt());
            return detail;
        });
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

        // Schedule at 2:00 PM on preferred date
        OffsetDateTime scheduled = request.getPreferredDate().atTime(14, 0).atOffset(ZoneOffset.UTC);
        doc.setScheduledDateTime(scheduled);
        doc.setCreatedAt(OffsetDateTime.now());

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
        Optional<EnquiryDocument> opt = enquiryRepository.findById(enquiryId);
        if (opt.isEmpty()) {
            opt = enquiryRepository.findByReferenceTicket(enquiryId);
        }

        if (opt.isEmpty()) {
            return Optional.empty();
        }

        EnquiryDocument doc = opt.get();
        doc.setStatus("CANCELLED");
        doc.setUpdatedAt(OffsetDateTime.now());
        doc.getResolutionNotes().add("Cancelled by customer: " + request.getReason());

        enquiryRepository.save(doc);

        EnquiryResponse response = new EnquiryResponse();
        response.setEnquiryId(doc.getId());
        response.setReferenceTicket(doc.getReferenceTicket());
        response.setStatus(EnquiryResponse.StatusEnum.CANCELLED);
        response.setCreatedAt(doc.getCreatedAt());
        return Optional.of(response);
    }
}
