package com.aviral.carguru;

import com.aviral.carguru.document.*;
import com.aviral.carguru.model.*;
import com.aviral.carguru.repository.EnquiryRepository;
import com.aviral.carguru.repository.FinancingApplicationRepository;
import com.aviral.carguru.repository.TestDriveBookingRepository;
import com.aviral.carguru.service.FinancingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class FinancingServiceTest {

    private FinancingService financingService;
    private FinancingApplicationRepository applicationRepository;
    private EnquiryRepository enquiryRepository;
    private TestDriveBookingRepository testDriveBookingRepository;

    @BeforeEach
    void setUp() {
        applicationRepository = Mockito.mock(FinancingApplicationRepository.class);
        enquiryRepository = Mockito.mock(EnquiryRepository.class);
        testDriveBookingRepository = Mockito.mock(TestDriveBookingRepository.class);
        financingService = new FinancingService(applicationRepository, enquiryRepository, testDriveBookingRepository);
    }

    @Test
    void testCalculateLoan() {
        LoanCalculationRequest request = new LoanCalculationRequest();
        request.setVehiclePrice(100000.0);
        request.setDownPayment(20000.0);
        request.setTradeInValue(0.0);
        request.setSalesTaxRate(7.0);
        request.setInterestRateAnnual(4.0);
        request.setTenureMonths(60);

        LoanCalculationResponse response = financingService.calculateLoan(request);

        assertNotNull(response);
        assertEquals(100000.0, response.getVehiclePrice());
        assertEquals(7000.0, response.getTotalSalesTax());
        assertEquals(87000.0, response.getNetCapitalizedCost());
        assertTrue(response.getMonthlyPayment() > 0);
        assertEquals(5, response.getAmortizationSchedule().size());
    }

    @Test
    void testListApplicationsWithFilter() {
        FinancingApplicationDocument doc = new FinancingApplicationDocument();
        doc.setId("app-999");
        doc.setReferenceNumber("VEL-APP-2026-9999");
        doc.setStatus(ApplicationStatus.UNDER_REVIEW);

        when(applicationRepository.findApplicationsWithDynamicFilter(eq("UNDER_REVIEW"), isNull(), isNull(), any()))
                .thenReturn(List.of(doc));
        when(applicationRepository.countApplicationsWithDynamicFilter(eq("UNDER_REVIEW"), isNull(), isNull()))
                .thenReturn(1L);

        FinancingApplicationsListResponse response = financingService.listApplications("UNDER_REVIEW", null, null, PageRequest.of(0, 10));

        assertNotNull(response);
        assertEquals(1, response.getTotalCount());
        assertEquals(1, response.getApplications().size());
        assertEquals("app-999", response.getApplications().get(0).getApplicationId());
    }

    @Test
    void testUnderwriterApprovalUpdatesLoanTermsAndAppendsStatusHistory() {
        String appId = "app-12345";
        FinancingApplicationDocument existingApp = new FinancingApplicationDocument();
        existingApp.setId(appId);
        existingApp.setReferenceNumber("VEL-APP-2026-1001");
        existingApp.setStatus(ApplicationStatus.UNDER_REVIEW);

        LoanTerms loanTerms = new LoanTerms();
        loanTerms.setRequestedLoanAmount(75000.0);
        loanTerms.setDownPayment(15000.0);
        loanTerms.setTenureMonths(60);
        existingApp.setLoanTerms(loanTerms);

        List<StatusAuditLog> history = new ArrayList<>();
        StatusAuditLog init = new StatusAuditLog();
        init.setStatus("SUBMITTED");
        init.setNote("Initial submission");
        history.add(init);
        existingApp.setStatusHistory(history);

        when(applicationRepository.findById(appId)).thenReturn(Optional.of(existingApp));
        when(applicationRepository.save(any(FinancingApplicationDocument.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UnderwritingReviewRequest reviewRequest = new UnderwritingReviewRequest();
        reviewRequest.setStatus(UnderwritingReviewRequest.StatusEnum.APPROVED);
        reviewRequest.setApprovedAmount(BigDecimal.valueOf(70000.0));
        reviewRequest.setOfferedApr(BigDecimal.valueOf(4.25));
        reviewRequest.setUnderwriterName("Aditi Sharma");
        reviewRequest.setNote("Approved after comprehensive credit bureau & KYC check.");

        Optional<FinancingApplicationDetail> responseOpt = financingService.reviewApplication(appId, reviewRequest);

        assertTrue(responseOpt.isPresent());
        FinancingApplicationDetail response = responseOpt.get();
        assertEquals(FinancingApplicationDetail.StatusEnum.APPROVED, response.getStatus());
        assertEquals(70000.0, response.getLoanTerms().getApprovedAmount());
        assertEquals(4.25, response.getLoanTerms().getOfferedApr());

        ArgumentCaptor<FinancingApplicationDocument> captor = ArgumentCaptor.forClass(FinancingApplicationDocument.class);
        verify(applicationRepository).save(captor.capture());
        FinancingApplicationDocument saved = captor.getValue();

        assertEquals(ApplicationStatus.APPROVED, saved.getStatus());
        assertEquals(70000.0, saved.getLoanTerms().getApprovedAmount());
        assertEquals(4.25, saved.getLoanTerms().getOfferedApr());
        assertNotNull(saved.getUpdatedAt());

        // Verify Status History Audit Trail
        assertEquals(2, saved.getStatusHistory().size());
        StatusAuditLog lastAudit = saved.getStatusHistory().get(1);
        assertEquals("APPROVED", lastAudit.getStatus());
        assertEquals("Aditi Sharma", lastAudit.getAuthorName());
        assertEquals("Approved after comprehensive credit bureau & KYC check.", lastAudit.getNote());
        assertNotNull(lastAudit.getTimestamp());
    }

    @Test
    void testDocumentVerificationUpdatesStatus() {
        String appId = "app-67890";
        String docId = "DOC-A1B2C3";

        FinancingApplicationDocument existingApp = new FinancingApplicationDocument();
        existingApp.setId(appId);
        existingApp.setReferenceNumber("VEL-APP-2026-2002");
        existingApp.setStatus(ApplicationStatus.DOCS_REQUIRED);

        DocumentMetadata docItem = new DocumentMetadata();
        docItem.setDocumentId(docId);
        docItem.setDocumentType(DocumentItem.DocumentTypeEnum.PAY_SLIP);
        docItem.setStatus(DocumentItem.StatusEnum.UPLOADED);
        docItem.setFileName("payslip_aug2026.pdf");

        existingApp.setRequiredDocuments(new ArrayList<>(List.of(docItem)));
        existingApp.setStatusHistory(new ArrayList<>());

        when(applicationRepository.findById(appId)).thenReturn(Optional.of(existingApp));
        when(applicationRepository.save(any(FinancingApplicationDocument.class))).thenAnswer(invocation -> invocation.getArgument(0));

        DocumentVerificationRequest verifyRequest = new DocumentVerificationRequest();
        verifyRequest.setStatus(DocumentVerificationRequest.StatusEnum.VERIFIED);

        Optional<ApplicationDocument> responseOpt = financingService.verifyDocument(appId, docId, verifyRequest);

        assertTrue(responseOpt.isPresent());
        ApplicationDocument response = responseOpt.get();
        assertEquals(ApplicationDocument.StatusEnum.VERIFIED, response.getStatus());

        ArgumentCaptor<FinancingApplicationDocument> captor = ArgumentCaptor.forClass(FinancingApplicationDocument.class);
        verify(applicationRepository).save(captor.capture());
        FinancingApplicationDocument saved = captor.getValue();

        DocumentMetadata savedDoc = saved.getRequiredDocuments().getFirst();
        assertEquals(DocumentItem.StatusEnum.VERIFIED, savedDoc.getStatus());

        // Verify Audit Log
        assertEquals(1, saved.getStatusHistory().size());
        StatusAuditLog audit = saved.getStatusHistory().getFirst();
        assertEquals("DOC_VERIFICATION", audit.getStatus());
        assertTrue(audit.getNote().contains("PAY_SLIP marked as VERIFIED"));
    }

    @Test
    void testPortfolioSummaryAggregationComputesCorrectTotals() {
        // App 1: Prime+ (Score 800), Full-Time, Approved, Requested 50000, Approved 50000
        FinancingApplicationDocument app1 = new FinancingApplicationDocument();
        app1.setId("app-1");
        app1.setStatus(ApplicationStatus.APPROVED);
        app1.setCibilScore(800);
        app1.setSubmittedAt(Instant.parse("2026-06-15T10:00:00Z"));
        LoanTerms lt1 = new LoanTerms();
        lt1.setRequestedLoanAmount(50000.0);
        lt1.setApprovedAmount(50000.0);
        app1.setLoanTerms(lt1);
        Employment emp1 = new Employment();
        emp1.setEmploymentType(EmploymentDetails.EmploymentTypeEnum.FULL_TIME);
        app1.setEmployment(emp1);
        VehicleDetails veh1 = new VehicleDetails();
        veh1.setMake("Mercedes-Benz");
        app1.setVehicleDetails(veh1);

        // App 2: Prime (Score 740), Self-Employed, Approved, Requested 80000, Approved 75000
        FinancingApplicationDocument app2 = new FinancingApplicationDocument();
        app2.setId("app-2");
        app2.setStatus(ApplicationStatus.APPROVED);
        app2.setCibilScore(740);
        app2.setSubmittedAt(Instant.parse("2026-06-20T10:00:00Z"));
        LoanTerms lt2 = new LoanTerms();
        lt2.setRequestedLoanAmount(80000.0);
        lt2.setApprovedAmount(75000.0);
        app2.setLoanTerms(lt2);
        Employment emp2 = new Employment();
        emp2.setEmploymentType(EmploymentDetails.EmploymentTypeEnum.SELF_EMPLOYED);
        app2.setEmployment(emp2);
        VehicleDetails veh2 = new VehicleDetails();
        veh2.setMake("BMW");
        app2.setVehicleDetails(veh2);

        // App 3: Fair (Score 690), Business-Owner, Under-Review, Requested 60000
        FinancingApplicationDocument app3 = new FinancingApplicationDocument();
        app3.setId("app-3");
        app3.setStatus(ApplicationStatus.UNDER_REVIEW);
        app3.setCibilScore(690);
        app3.setSubmittedAt(Instant.parse("2026-07-05T10:00:00Z"));
        LoanTerms lt3 = new LoanTerms();
        lt3.setRequestedLoanAmount(60000.0);
        app3.setLoanTerms(lt3);
        Employment emp3 = new Employment();
        emp3.setEmploymentType(EmploymentDetails.EmploymentTypeEnum.CONTRACTOR);
        app3.setEmployment(emp3);
        VehicleDetails veh3 = new VehicleDetails();
        veh3.setMake("Audi");
        app3.setVehicleDetails(veh3);

        // App 4: Subprime (Score 620), Rejected, Requested 40000
        FinancingApplicationDocument app4 = new FinancingApplicationDocument();
        app4.setId("app-4");
        app4.setStatus(ApplicationStatus.REJECTED);
        app4.setCibilScore(620);
        app4.setSubmittedAt(Instant.parse("2026-07-10T10:00:00Z"));
        LoanTerms lt4 = new LoanTerms();
        lt4.setRequestedLoanAmount(40000.0);
        app4.setLoanTerms(lt4);

        when(applicationRepository.findAll()).thenReturn(List.of(app1, app2, app3, app4));
        when(enquiryRepository.count()).thenReturn(15L);
        when(testDriveBookingRepository.count()).thenReturn(8L);

        PortfolioSummaryResponse summary = financingService.getPortfolioSummary();

        assertNotNull(summary);
        assertNotNull(summary.getKpis());

        PortfolioKpis kpis = summary.getKpis();

        assertEquals(4, kpis.getTotalApplications());
        // Total Requested: 50000 + 80000 + 60000 + 40000 = 230000.0
        assertEquals(BigDecimal.valueOf(230000.0), kpis.getTotalRequestedVolume());
        // Total Approved: 50000 + 75000 = 125000.0
        assertEquals(BigDecimal.valueOf(125000.0), kpis.getTotalApprovedVolume());
        // Approval rate: 2 out of 4 = 50.0%
        assertEquals(BigDecimal.valueOf(50.0), kpis.getApprovalRate());
        // Avg ticket: 230000 / 4 = 57500.0
        assertEquals(BigDecimal.valueOf(57500.0), kpis.getAvgTicketSize());
        assertEquals(15, kpis.getActiveEnquiries());
        assertEquals(8, kpis.getScheduledTestDrives());
        assertEquals(1, kpis.getUnderReviewCount());
        assertEquals(2, kpis.getApprovedCount());
        assertEquals(1, kpis.getRejectedCount());

        // CIBIL Distribution check
        List<CibilDistributionItem> cibil = summary.getCibilDistribution();
        assertEquals(4, cibil.size());

        CibilDistributionItem primePlus = cibil.get(0);
        assertEquals(1, primePlus.getCount());

        CibilDistributionItem prime = cibil.get(1);
        assertEquals(1, prime.getCount());

        CibilDistributionItem fair = cibil.get(2);
        assertEquals(1, fair.getCount());

        CibilDistributionItem subprime = cibil.get(3);
        assertEquals(1, subprime.getCount());
    }
}
