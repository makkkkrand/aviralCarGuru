package com.aviral.carguru.config;

import com.aviral.carguru.document.*;
import com.aviral.carguru.model.CustomerContact;
import com.aviral.carguru.model.DocumentItem;
import com.aviral.carguru.model.VehicleReference;
import com.aviral.carguru.repository.EnquiryRepository;
import com.aviral.carguru.repository.FinancingApplicationRepository;
import com.aviral.carguru.repository.TestDriveBookingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final FinancingApplicationRepository applicationRepository;
    private final EnquiryRepository enquiryRepository;
    private final TestDriveBookingRepository testDriveBookingRepository;

    public DataInitializer(FinancingApplicationRepository applicationRepository,
                           EnquiryRepository enquiryRepository,
                           TestDriveBookingRepository testDriveBookingRepository) {
        this.applicationRepository = applicationRepository;
        this.enquiryRepository = enquiryRepository;
        this.testDriveBookingRepository = testDriveBookingRepository;
    }

    @Override
    public void run(String... args) {
        try {
            seedFinancingApplications();
            seedEnquiries();
            log.info("[CarGuru DataInitializer] Seed data verification completed successfully.");
        } catch (Exception e) {
            log.warn("[CarGuru DataInitializer] Could not seed database (MongoDB may be in offline/read-only mode): {}", e.getMessage());
        }
    }

    private void seedFinancingApplications() {
        if (applicationRepository.findByReferenceNumberIgnoreCase("VEL-APP-2026-DEMO01").isEmpty()) {
            FinancingApplicationDocument app1 = new FinancingApplicationDocument();
            app1.setId("app_sample_velora_01");
            app1.setReferenceNumber("VEL-APP-2026-DEMO01");
            app1.setStatus("UNDER_REVIEW");
            app1.setCibilScore(785);
            app1.setSubmittedAt(Instant.now().minusSeconds(86400));
            app1.setUpdatedAt(Instant.now());

            Applicant a1 = new Applicant();
            a1.setFirstName("Aarav");
            a1.setLastName("Sharma");
            a1.setEmail("aarav.sharma@velora.in");
            a1.setPhone("+91 98201 92830");
            a1.setDateOfBirth(LocalDate.of(1988, 6, 14));
            a1.setAddressLine1("Flat 1802, Worli Sea Face");
            a1.setCity("Mumbai");
            a1.setState("Maharashtra");
            a1.setPostalCode("400018");
            a1.setHousingStatus("OWN_WITH_MORTGAGE");
            a1.setMonthlyHousingPayment(180000.0);
            app1.setApplicant(a1);

            Employment e1 = new Employment();
            e1.setEmploymentType("FULL_TIME");
            e1.setEmployerName("Reliance Capital Advisory");
            e1.setJobTitle("Senior Vice President");
            e1.setMonthsAtCurrentEmployer(84);
            e1.setMonthlyGrossIncome(1850000.0);
            app1.setEmployment(e1);

            VehicleDetails v1 = new VehicleDetails();
            v1.setVehicleId("VEL-2026-GT");
            v1.setMake("Mercedes-AMG");
            v1.setModel("GT 4-Door Coupe");
            v1.setYear(2026);
            v1.setTrim("63 S E Performance");
            v1.setPurchasePrice(27000000.0);
            app1.setVehicleDetails(v1);

            LoanTerms l1 = new LoanTerms();
            l1.setDownPayment(5400000.0);
            l1.setTradeInValue(0.0);
            l1.setTenureMonths(60);
            l1.setRequestedLoanAmount(21600000.0);
            l1.setApprovedAmount(21600000.0);
            l1.setOfferedApr(8.49);
            app1.setLoanTerms(l1);

            List<DocumentMetadata> docs1 = new ArrayList<>();
            DocumentMetadata doc1 = new DocumentMetadata();
            doc1.setDocumentId("DOC-INIT-ID01");
            doc1.setDocumentType(DocumentItem.DocumentTypeEnum.GOVERNMENT_ID);
            doc1.setStatus(DocumentItem.StatusEnum.VERIFIED);
            doc1.setFileName("PAN_Card_AaravSharma.pdf");
            doc1.setUploadedAt(Instant.now().minusSeconds(80000).atOffset(ZoneOffset.UTC));
            docs1.add(doc1);

            DocumentMetadata doc2 = new DocumentMetadata();
            doc2.setDocumentId("DOC-INIT-PAY01");
            doc2.setDocumentType(DocumentItem.DocumentTypeEnum.PAY_SLIP);
            doc2.setStatus(DocumentItem.StatusEnum.VERIFIED);
            doc2.setFileName("SalarySlips_Q1_2026.pdf");
            doc2.setUploadedAt(Instant.now().minusSeconds(75000).atOffset(ZoneOffset.UTC));
            docs1.add(doc2);

            DocumentMetadata doc3 = new DocumentMetadata();
            doc3.setDocumentId("DOC-INIT-BANK01");
            doc3.setDocumentType(DocumentItem.DocumentTypeEnum.BANK_STATEMENT);
            doc3.setStatus(DocumentItem.StatusEnum.PENDING);
            docs1.add(doc3);
            app1.setRequiredDocuments(docs1);

            List<StatusAuditLog> hist1 = new ArrayList<>();
            hist1.add(new StatusAuditLog("SUBMITTED", Instant.now().minusSeconds(86400).atOffset(ZoneOffset.UTC), "Applicant", "Application submitted via CarGuru India Client Portal."));
            hist1.add(new StatusAuditLog("UNDER_REVIEW", Instant.now().minusSeconds(43200).atOffset(ZoneOffset.UTC), "Priya Nair (Senior Underwriter)", "Assigned to Senior Underwriting Officer at Mumbai Flagship. KYC & PAN verified."));
            app1.setStatusHistory(hist1);

            applicationRepository.save(app1);
            log.info("[CarGuru DataInitializer] Seeded demo application VEL-APP-2026-DEMO01");
        }

        if (applicationRepository.findByReferenceNumberIgnoreCase("VEL-APP-2026-DEMO02").isEmpty()) {
            FinancingApplicationDocument app2 = new FinancingApplicationDocument();
            app2.setId("app_sample_velora_02");
            app2.setReferenceNumber("VEL-APP-2026-DEMO02");
            app2.setStatus("APPROVED");
            app2.setCibilScore(760);
            app2.setSubmittedAt(Instant.now().minusSeconds(172800));
            app2.setUpdatedAt(Instant.now().minusSeconds(86400));

            Applicant a2 = new Applicant();
            a2.setFirstName("Rajesh");
            a2.setLastName("Kulkarni");
            a2.setEmail("rajesh@kulkarni-eng.com");
            a2.setPhone("+91 98220 54123");
            a2.setDateOfBirth(LocalDate.of(1979, 11, 20));
            a2.setAddressLine1("Plot 44, Kalyani Nagar");
            a2.setCity("Pune");
            a2.setState("Maharashtra");
            a2.setPostalCode("411006");
            a2.setHousingStatus("OWN_OUTRIGHT");
            a2.setMonthlyHousingPayment(0.0);
            app2.setApplicant(a2);

            Employment e2 = new Employment();
            e2.setEmploymentType("SELF_EMPLOYED");
            e2.setEmployerName("Kulkarni Precision Engineering Ltd");
            e2.setJobTitle("Managing Director & Founder");
            e2.setMonthsAtCurrentEmployer(140);
            e2.setMonthlyGrossIncome(650000.0);
            app2.setEmployment(e2);

            VehicleDetails v2 = new VehicleDetails();
            v2.setVehicleId("CG-2026-XUV700");
            v2.setMake("Mahindra");
            v2.setModel("XUV700");
            v2.setYear(2026);
            v2.setTrim("AX7 Luxury AWD");
            v2.setPurchasePrice(2690000.0);
            app2.setVehicleDetails(v2);

            LoanTerms l2 = new LoanTerms();
            l2.setDownPayment(500000.0);
            l2.setTradeInValue(0.0);
            l2.setTenureMonths(48);
            l2.setRequestedLoanAmount(2190000.0);
            l2.setApprovedAmount(2190000.0);
            l2.setOfferedApr(8.99);
            app2.setLoanTerms(l2);

            List<StatusAuditLog> hist2 = new ArrayList<>();
            hist2.add(new StatusAuditLog("SUBMITTED", Instant.now().minusSeconds(172800).atOffset(ZoneOffset.UTC), "Applicant", "Loan application submitted."));
            hist2.add(new StatusAuditLog("APPROVED", Instant.now().minusSeconds(86400).atOffset(ZoneOffset.UTC), "Priya Nair", "Full loan amount sanctioned at prime partner APR 8.99%."));
            app2.setStatusHistory(hist2);

            applicationRepository.save(app2);
            log.info("[CarGuru DataInitializer] Seeded demo application VEL-APP-2026-DEMO02");
        }
    }

    private void seedEnquiries() {
        if (enquiryRepository.findByReferenceTicketIgnoreCase("VEL-ENQ-DEMO01").isEmpty()) {
            EnquiryDocument enq = new EnquiryDocument();
            enq.setId("enq_sample_01");
            enq.setReferenceTicket("VEL-ENQ-DEMO01");
            enq.setEnquiryType("PRICE_QUOTE");
            enq.setStatus("IN_PROGRESS");
            enq.setAssignedAdvisor("Priya Nair (Senior Loan Advisor)");
            enq.setCreatedAt(Instant.now().minusSeconds(120000));
            enq.setUpdatedAt(Instant.now());

            CustomerContact c = new CustomerContact();
            c.setFirstName("Vikram");
            c.setLastName("Mehta");
            c.setEmail("vikram.mehta@finvest.in");
            c.setPhone("+91 98331 44210");
            c.setPreferredContactMethod("PHONE");
            enq.setCustomer(c);

            VehicleReference vr = new VehicleReference();
            vr.setVehicleId("CG-2026-FORTUNER");
            vr.setMake("Toyota");
            vr.setModel("Fortuner");
            vr.setTrim("GR-Sport 4x4 AT");
            enq.setVehicleReference(vr);

            enq.setMessage("Requesting competitive EMI quote and zero down payment options for commercial leasing.");
            enquiryRepository.save(enq);
            log.info("[CarGuru DataInitializer] Seeded demo enquiry VEL-ENQ-DEMO01");
        }
    }
}
