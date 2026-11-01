package com.aviral.carguru.controller;

import com.aviral.carguru.api.EnquiriesApi;
import com.aviral.carguru.model.*;
import com.aviral.carguru.service.EnquiryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class EnquiriesApiController implements EnquiriesApi {

    private final EnquiryService enquiryService;

    public EnquiriesApiController(EnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    @Override
    public ResponseEntity<EnquiryResponse> createEnquiry(CreateEnquiryRequest request) {
        EnquiryResponse response = enquiryService.createEnquiry(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Override
    public ResponseEntity<EnquiriesListResponse> listEnquiries(String status, String type) {
        EnquiriesListResponse response = enquiryService.listEnquiries(status, type);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<EnquiryDetail> getEnquiryById(String enquiryId) {
        return enquiryService.getEnquiryById(enquiryId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<EnquiryDetail> updateEnquiry(String enquiryId, UpdateEnquiryRequest request) {
        return enquiryService.updateEnquiry(enquiryId, request)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<EnquiryCategoriesResponse> getEnquiryCategories() {
        return ResponseEntity.ok(enquiryService.getEnquiryCategories());
    }

    @Override
    public ResponseEntity<List<TestDriveBookingDetail>> listTestDrives() {
        List<TestDriveBookingDetail> response = enquiryService.listTestDrives();
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<TestDriveBookingResponse> bookTestDrive(TestDriveBookingRequest request) {
        TestDriveBookingResponse response = enquiryService.bookTestDrive(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Override
    public ResponseEntity<TestDriveBookingDetail> updateTestDrive(String bookingId, UpdateTestDriveRequest request) {
        return enquiryService.updateTestDrive(bookingId, request)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<EnquiryResponse> cancelEnquiry(String enquiryId, CancelEnquiryRequest request) {
        return enquiryService.cancelEnquiry(enquiryId, request)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
