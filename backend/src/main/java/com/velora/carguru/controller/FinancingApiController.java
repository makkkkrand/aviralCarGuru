package com.velora.carguru.controller;

import com.velora.carguru.api.FinancingApi;
import com.velora.carguru.model.*;
import com.velora.carguru.service.FinancingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FinancingApiController implements FinancingApi {

    private final FinancingService financingService;

    public FinancingApiController(FinancingService financingService) {
        this.financingService = financingService;
    }

    @Override
    public ResponseEntity<LoanCalculationResponse> calculateLoan(LoanCalculationRequest request) {
        LoanCalculationResponse response = financingService.calculateLoan(request);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<FinanceOptionsResponse> getFinancingOptions(String creditTier) {
        FinanceOptionsResponse response = financingService.getFinancingOptions(creditTier);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<PreQualificationResponse> submitPreQualification(PreQualificationRequest request) {
        PreQualificationResponse response = financingService.submitPreQualification(request);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<FinancingApplicationResponse> submitFinancingApplication(FinancingApplicationRequest request) {
        FinancingApplicationResponse response = financingService.submitFinancingApplication(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Override
    public ResponseEntity<FinancingApplicationDetail> getFinancingApplication(String applicationId, String applicantEmail) {
        return financingService.getFinancingApplication(applicationId, applicantEmail)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<DocumentSubmissionResponse> uploadApplicationDocument(String applicationId, DocumentSubmissionRequest request) {
        return financingService.uploadApplicationDocument(applicationId, request)
                .map(res -> ResponseEntity.status(HttpStatus.CREATED).body(res))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
