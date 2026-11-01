package com.aviral.carguru;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.aviral.carguru.controller.FinancingApiController;
import com.aviral.carguru.document.ApplicationStatus;
import com.aviral.carguru.model.*;
import com.aviral.carguru.service.FinancingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FinancingApiController.class)
public class FinancingApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private FinancingService financingService;

    @Test
    void testListApplicationsEndpoint() throws Exception {
        FinancingApplicationsListResponse response = new FinancingApplicationsListResponse();
        response.setTotalCount(1);
        response.setTotal(1);

        FinancingApplicationDetail detail = new FinancingApplicationDetail();
        detail.setApplicationId("app-123");
        detail.setReferenceNumber("VEL-APP-2026-ABCD");
        detail.setStatus(FinancingApplicationDetail.StatusEnum.SUBMITTED);
        response.setApplications(List.of(detail));

        when(financingService.listApplications("SUBMITTED", "FULL_TIME", "VEL")).thenReturn(response);

        mockMvc.perform(get("/api/v1/financing/applications")
                        .param("status", "SUBMITTED")
                        .param("employmentType", "FULL_TIME")
                        .param("search", "VEL"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCount").value(1))
                .andExpect(jsonPath("$.applications[0].applicationId").value("app-123"))
                .andExpect(jsonPath("$.applications[0].status").value("SUBMITTED"));
    }

    @Test
    void testReviewApplicationEndpoint() throws Exception {
        UnderwritingReviewRequest request = new UnderwritingReviewRequest();
        request.setStatus(UnderwritingReviewRequest.StatusEnum.APPROVED);
        request.setApprovedAmount(BigDecimal.valueOf(8500000.0));
        request.setOfferedApr(BigDecimal.valueOf(8.25));
        request.setUnderwriterName("Vikram Singhania");
        request.setNote("Sanctioned luxury auto loan.");

        FinancingApplicationDetail detail = new FinancingApplicationDetail();
        detail.setApplicationId("app-456");
        detail.setStatus(FinancingApplicationDetail.StatusEnum.APPROVED);

        when(financingService.reviewApplication(eq("app-456"), any(UnderwritingReviewRequest.class)))
                .thenReturn(Optional.of(detail));

        mockMvc.perform(patch("/api/v1/financing/applications/app-456/review")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.applicationId").value("app-456"))
                .andExpect(jsonPath("$.status").value("APPROVED"));
    }

    @Test
    void testVerifyDocumentEndpoint() throws Exception {
        DocumentVerificationRequest request = new DocumentVerificationRequest();
        request.setStatus(DocumentVerificationRequest.StatusEnum.VERIFIED);
        request.setNote("Verified against bureau database.");

        ApplicationDocument doc = new ApplicationDocument();
        doc.setDocumentId("DOC-9988");
        doc.setStatus(ApplicationDocument.StatusEnum.VERIFIED);

        when(financingService.verifyDocument(eq("app-789"), eq("DOC-9988"), any(DocumentVerificationRequest.class)))
                .thenReturn(Optional.of(doc));

        mockMvc.perform(patch("/api/v1/financing/applications/app-789/documents/DOC-9988")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.documentId").value("DOC-9988"))
                .andExpect(jsonPath("$.status").value("VERIFIED"));
    }

    @Test
    void testGetPortfolioSummaryEndpoint() throws Exception {
        PortfolioSummaryResponse response = new PortfolioSummaryResponse();
        PortfolioKpis kpis = new PortfolioKpis();
        kpis.setTotalApplications(100);
        kpis.setTotalRequestedVolume(BigDecimal.valueOf(50000000.0));
        kpis.setTotalApprovedVolume(BigDecimal.valueOf(40000000.0));
        kpis.setApprovalRate(BigDecimal.valueOf(80.0));
        kpis.setAvgTicketSize(BigDecimal.valueOf(500000.0));
        response.setKpis(kpis);
        response.setCibilDistribution(List.of());
        response.setEmploymentDistribution(List.of());
        response.setMonthlyVolumeHistory(List.of());

        when(financingService.getPortfolioSummary()).thenReturn(response);

        mockMvc.perform(get("/api/v1/analytics/portfolio-summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.kpis.totalApplications").value(100))
                .andExpect(jsonPath("$.kpis.approvalRate").value(80.0));
    }
}

