package com.velora.carguru.controller;

import com.velora.carguru.api.EnquiriesApi;
import com.velora.carguru.model.*;
import com.velora.carguru.service.EnquiryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<EnquiryDetail> getEnquiryById(String enquiryId) {
        return enquiryService.getEnquiryById(enquiryId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<EnquiryCategoriesResponse> getEnquiryCategories() {
        return ResponseEntity.ok(enquiryService.getEnquiryCategories());
    }

    @Override
    public ResponseEntity<TestDriveBookingResponse> bookTestDrive(TestDriveBookingRequest request) {
        TestDriveBookingResponse response = enquiryService.bookTestDrive(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Override
    public ResponseEntity<EnquiryResponse> cancelEnquiry(String enquiryId, CancelEnquiryRequest request) {
        return enquiryService.cancelEnquiry(enquiryId, request)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
