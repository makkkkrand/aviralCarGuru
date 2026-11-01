package com.aviral.carguru.config;

import com.aviral.carguru.document.*;
import com.aviral.carguru.model.*;
import com.aviral.carguru.repository.EnquiryRepository;
import com.aviral.carguru.repository.FinancingApplicationRepository;
import com.aviral.carguru.repository.TestDriveBookingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Component
@Profile("!test")
public class DayZeroDataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DayZeroDataInitializer.class);

    private final FinancingApplicationRepository financingApplicationRepository;
    private final EnquiryRepository enquiryRepository;
    private final TestDriveBookingRepository testDriveBookingRepository;

    public DayZeroDataInitializer(
            FinancingApplicationRepository financingApplicationRepository,
            EnquiryRepository enquiryRepository,
            TestDriveBookingRepository testDriveBookingRepository) {
        this.financingApplicationRepository = financingApplicationRepository;
        this.enquiryRepository = enquiryRepository;
        this.testDriveBookingRepository = testDriveBookingRepository;
    }

    @Override
    public void run(String... args) {
        log.info("Checking Day Zero MongoDB setup for CarGuru India...");

        if (financingApplicationRepository.count() == 0) {
            log.info("Financing applications collection is empty. Seeding Day Zero applications...");
            seedFinancingApplications();
        } else {
            log.info("Financing applications already seeded. Total count: {}", financingApplicationRepository.count());
        }

        if (enquiryRepository.count() == 0) {
            log.info("Enquiries collection is empty. Seeding Day Zero enquiries...");
            seedEnquiries();
        } else {
            log.info("Enquiries already seeded. Total count: {}", enquiryRepository.count());
        }

        if (testDriveBookingRepository.count() == 0) {
            log.info("Test drive bookings collection is empty. Seeding Day Zero bookings...");
            seedTestDriveBookings();
        } else {
            log.info("Test drive bookings already seeded. Total count: {}", testDriveBookingRepository.count());
        }

        log.info("Day Zero MongoDB verification complete.");
    }

    private void seedFinancingApplications() {
        List<FinancingApplicationDocument> apps = new ArrayList<>();

        // App 1: Prime+ (810) - APPROVED
        FinancingApplicationDocument app1 = new FinancingApplicationDocument();
        app1.setReferenceNumber("VEL-APP-2026-A101");
        app1.setStatus(ApplicationStatus.APPROVED);
        app1.setCibilScore(810);

        Applicant a1 = new Applicant();
        a1.setFirstName("Arjun");
        a1.setLastName("Mehta");
        a1.setEmail("arjun.mehta@example.com");
        a1.setPhone("+919876543210");
        a1.setDateOfBirth(LocalDate.of(1987, 5, 14));
        a1.setAddressLine1("Penthouse 4B, Prestige Kingfisher Towers");
        a1.setAddressLine2("Lavelle Road");
        a1.setCity("Bengaluru");
        a1.setState("Karnataka");
        a1.setPostalCode("560001");
        a1.setHousingStatus(ApplicantPersonalDetails.HousingStatusEnum.OWN_OUTRIGHT);
        a1.setMonthlyHousingPayment(0.0);
        app1.setApplicant(a1);

        Employment e1 = new Employment();
        e1.setEmployerName("Infosys Technologies Ltd");
        e1.setJobTitle("Principal Cloud Architect");
        e1.setEmploymentType(EmploymentDetails.EmploymentTypeEnum.FULL_TIME);
        e1.setMonthlyGrossIncome(285000.0);
        e1.setMonthsAtCurrentEmployer(72);
        app1.setEmployment(e1);

        VehicleDetails v1 = new VehicleDetails();
        v1.setVehicleId("VEL-2026-GT");
        v1.setVin("WDD2906891A987654");
        v1.setMake("Mercedes-AMG");
        v1.setModel("GT 4-Door Coupe");
        v1.setYear(2026);
        v1.setTrim("63 S E Performance");
        v1.setPurchasePrice(98500.0);
        app1.setVehicleDetails(v1);

        LoanTerms l1 = new LoanTerms();
        l1.setRequestedLoanAmount(80000.0);
        l1.setApprovedAmount(80000.0);
        l1.setOfferedApr(8.45);
        l1.setTenureMonths(48);
        l1.setDownPayment(18500.0);
        app1.setLoanTerms(l1);

        ApplicationConsents c1 = new ApplicationConsents(true, true);
        c1.setContactViaSmsAccepted(true);
        app1.setConsents(c1);

        Instant t1 = Instant.parse("2026-03-01T10:00:00Z");
        app1.setSubmittedAt(t1);
        app1.setUpdatedAt(t1.plusSeconds(86400));

        List<DocumentMetadata> docs1 = new ArrayList<>();
        DocumentMetadata pan1 = new DocumentMetadata();
        pan1.setDocumentId("DOC-PAN-A101");
        pan1.setDocumentType(DocumentItem.DocumentTypeEnum.GOVERNMENT_ID);
        pan1.setFileName("arjun_pan_card.pdf");
        pan1.setStatus(DocumentItem.StatusEnum.VERIFIED);
        pan1.setUploadedAt(t1.atOffset(ZoneOffset.UTC));
        pan1.setVerifiedAt(t1.plusSeconds(3600).atOffset(ZoneOffset.UTC));
        docs1.add(pan1);

        DocumentMetadata pay1 = new DocumentMetadata();
        pay1.setDocumentId("DOC-PAY-A101");
        pay1.setDocumentType(DocumentItem.DocumentTypeEnum.PAY_SLIP);
        pay1.setFileName("infosys_jan_feb_salary_slip.pdf");
        pay1.setStatus(DocumentItem.StatusEnum.VERIFIED);
        pay1.setUploadedAt(t1.atOffset(ZoneOffset.UTC));
        pay1.setVerifiedAt(t1.plusSeconds(7200).atOffset(ZoneOffset.UTC));
        docs1.add(pay1);
        app1.setRequiredDocuments(docs1);

        List<StatusAuditLog> hist1 = new ArrayList<>();
        hist1.add(new StatusAuditLog("SUBMITTED", t1.atOffset(ZoneOffset.UTC), "System", "Application received via web portal. Automated CIBIL pull 810."));
        hist1.add(new StatusAuditLog("UNDER_REVIEW", t1.plusSeconds(1800).atOffset(ZoneOffset.UTC), "Priya Sharma (Senior Underwriter)", "Fast-track Prime+ portfolio queue assigned."));
        hist1.add(new StatusAuditLog("APPROVED", t1.plusSeconds(86400).atOffset(ZoneOffset.UTC), "Priya Sharma (Senior Underwriter)", "Approved with 8.45% APR on 48-month tenor. Excellent debt-service ratio."));
        app1.setStatusHistory(hist1);
        apps.add(app1);

        // App 2: Prime (745) - UNDER_REVIEW
        FinancingApplicationDocument app2 = new FinancingApplicationDocument();
        app2.setReferenceNumber("VEL-APP-2026-B202");
        app2.setStatus(ApplicationStatus.UNDER_REVIEW);
        app2.setCibilScore(745);

        Applicant a2 = new Applicant();
        a2.setFirstName("Rohan");
        a2.setLastName("Gupta");
        a2.setEmail("rohan.gupta@example.com");
        a2.setPhone("+919812345678");
        a2.setDateOfBirth(LocalDate.of(1991, 8, 22));
        a2.setAddressLine1("Sea Face Promenade, Worli");
        a2.setAddressLine2("Apt 1202");
        a2.setCity("Mumbai");
        a2.setState("Maharashtra");
        a2.setPostalCode("400018");
        a2.setHousingStatus(ApplicantPersonalDetails.HousingStatusEnum.OWN_WITH_MORTGAGE);
        a2.setMonthlyHousingPayment(45000.0);
        app2.setApplicant(a2);

        Employment e2 = new Employment();
        e2.setEmployerName("Gupta Design Studio");
        e2.setJobTitle("Principal Architect & Founder");
        e2.setEmploymentType(EmploymentDetails.EmploymentTypeEnum.SELF_EMPLOYED);
        e2.setMonthlyGrossIncome(340000.0);
        e2.setMonthsAtCurrentEmployer(48);
        app2.setEmployment(e2);

        VehicleDetails v2 = new VehicleDetails();
        v2.setVehicleId("VEL-2026-TAYCAN");
        v2.setVin("WP0AA2Y14PSA12345");
        v2.setMake("Porsche");
        v2.setModel("Taycan");
        v2.setYear(2026);
        v2.setTrim("Turbo S Cross Turismo");
        v2.setPurchasePrice(112000.0);
        app2.setVehicleDetails(v2);

        LoanTerms l2 = new LoanTerms();
        l2.setRequestedLoanAmount(90000.0);
        l2.setApprovedAmount(0.0);
        l2.setOfferedApr(8.95);
        l2.setTenureMonths(60);
        l2.setDownPayment(22000.0);
        app2.setLoanTerms(l2);

        ApplicationConsents c2 = new ApplicationConsents(true, true);
        c2.setContactViaSmsAccepted(true);
        app2.setConsents(c2);

        Instant t2 = Instant.parse("2026-03-05T14:30:00Z");
        app2.setSubmittedAt(t2);
        app2.setUpdatedAt(t2.plusSeconds(3600));

        List<DocumentMetadata> docs2 = new ArrayList<>();
        DocumentMetadata pan2 = new DocumentMetadata();
        pan2.setDocumentId("DOC-PAN-B202");
        pan2.setDocumentType(DocumentItem.DocumentTypeEnum.GOVERNMENT_ID);
        pan2.setFileName("rohan_pan.pdf");
        pan2.setStatus(DocumentItem.StatusEnum.VERIFIED);
        pan2.setUploadedAt(t2.atOffset(ZoneOffset.UTC));
        pan2.setVerifiedAt(t2.plusSeconds(1800).atOffset(ZoneOffset.UTC));
        docs2.add(pan2);

        DocumentMetadata bnk2 = new DocumentMetadata();
        bnk2.setDocumentId("DOC-BNK-B202");
        bnk2.setDocumentType(DocumentItem.DocumentTypeEnum.BANK_STATEMENT);
        bnk2.setFileName("hdfc_current_account_6months.pdf");
        bnk2.setStatus(DocumentItem.StatusEnum.PENDING);
        bnk2.setUploadedAt(t2.atOffset(ZoneOffset.UTC));
        docs2.add(bnk2);
        app2.setRequiredDocuments(docs2);

        List<StatusAuditLog> hist2 = new ArrayList<>();
        hist2.add(new StatusAuditLog("SUBMITTED", t2.atOffset(ZoneOffset.UTC), "System", "Application submitted. Bureau score 745."));
        hist2.add(new StatusAuditLog("UNDER_REVIEW", t2.plusSeconds(3600).atOffset(ZoneOffset.UTC), "Vikram Verma (Credit Underwriter)", "Self-employed current account cash flow review in progress."));
        app2.setStatusHistory(hist2);
        apps.add(app2);

        // App 3: Fair (695) - DOCS_REQUIRED
        FinancingApplicationDocument app3 = new FinancingApplicationDocument();
        app3.setReferenceNumber("VEL-APP-2026-C303");
        app3.setStatus(ApplicationStatus.DOCS_REQUIRED);
        app3.setCibilScore(695);

        Applicant a3 = new Applicant();
        a3.setFirstName("Sneha");
        a3.setLastName("Patel");
        a3.setEmail("sneha.patel@example.com");
        a3.setPhone("+919923456789");
        a3.setDateOfBirth(LocalDate.of(1985, 11, 3));
        a3.setAddressLine1("Bungalow 7, Bodakdev Enclave");
        a3.setAddressLine2("SG Highway");
        a3.setCity("Ahmedabad");
        a3.setState("Gujarat");
        a3.setPostalCode("380054");
        a3.setHousingStatus(ApplicantPersonalDetails.HousingStatusEnum.OWN_OUTRIGHT);
        a3.setMonthlyHousingPayment(0.0);
        app3.setApplicant(a3);

        Employment e3 = new Employment();
        e3.setEmployerName("Patel Freight & Logistics Pvt Ltd");
        e3.setJobTitle("Managing Director");
        e3.setEmploymentType(EmploymentDetails.EmploymentTypeEnum.SELF_EMPLOYED);
        e3.setMonthlyGrossIncome(520000.0);
        e3.setMonthsAtCurrentEmployer(96);
        app3.setEmployment(e3);

        VehicleDetails v3 = new VehicleDetails();
        v3.setVehicleId("VEL-2026-DB12");
        v3.setVin("SCFEBCAY4PG001122");
        v3.setMake("Aston Martin");
        v3.setModel("DB12");
        v3.setYear(2026);
        v3.setTrim("Super Tourer");
        v3.setPurchasePrice(248000.0);
        app3.setVehicleDetails(v3);

        LoanTerms l3 = new LoanTerms();
        l3.setRequestedLoanAmount(180000.0);
        l3.setApprovedAmount(0.0);
        l3.setOfferedApr(9.50);
        l3.setTenureMonths(60);
        l3.setDownPayment(68000.0);
        app3.setLoanTerms(l3);

        ApplicationConsents c3 = new ApplicationConsents(true, true);
        app3.setConsents(c3);

        Instant t3 = Instant.parse("2026-03-08T11:15:00Z");
        app3.setSubmittedAt(t3);
        app3.setUpdatedAt(t3.plusSeconds(7200));

        List<DocumentMetadata> docs3 = new ArrayList<>();
        DocumentMetadata pan3 = new DocumentMetadata();
        pan3.setDocumentId("DOC-PAN-C303");
        pan3.setDocumentType(DocumentItem.DocumentTypeEnum.GOVERNMENT_ID);
        pan3.setFileName("sneha_pan.pdf");
        pan3.setStatus(DocumentItem.StatusEnum.VERIFIED);
        pan3.setUploadedAt(t3.atOffset(ZoneOffset.UTC));
        pan3.setVerifiedAt(t3.plusSeconds(3600).atOffset(ZoneOffset.UTC));
        docs3.add(pan3);

        DocumentMetadata tax3 = new DocumentMetadata();
        tax3.setDocumentId("DOC-RES-C303");
        tax3.setDocumentType(DocumentItem.DocumentTypeEnum.PROOF_OF_RESIDENCE);
        tax3.setFileName("electricity_bill_residence.pdf");
        tax3.setStatus(DocumentItem.StatusEnum.REJECTED);
        tax3.setUploadedAt(t3.atOffset(ZoneOffset.UTC));
        tax3.setNotes("Electricity bill is over 3 months old. Please re-upload latest utility statement.");
        docs3.add(tax3);
        app3.setRequiredDocuments(docs3);

        List<StatusAuditLog> hist3 = new ArrayList<>();
        hist3.add(new StatusAuditLog("SUBMITTED", t3.atOffset(ZoneOffset.UTC), "System", "Application received for Aston Martin DB12."));
        hist3.add(new StatusAuditLog("UNDER_REVIEW", t3.plusSeconds(3600).atOffset(ZoneOffset.UTC), "Amit Sen (Risk Analyst)", "Assessing business entity debt exposure."));
        hist3.add(new StatusAuditLog("DOCS_REQUIRED", t3.plusSeconds(7200).atOffset(ZoneOffset.UTC), "Amit Sen (Risk Analyst)", "Uploaded residence proof rejected. Need recent utility bill within 90 days."));
        app3.setStatusHistory(hist3);
        apps.add(app3);

        // App 4: Subprime (635) - REJECTED
        FinancingApplicationDocument app4 = new FinancingApplicationDocument();
        app4.setReferenceNumber("VEL-APP-2026-D404");
        app4.setStatus(ApplicationStatus.REJECTED);
        app4.setCibilScore(635);

        Applicant a4 = new Applicant();
        a4.setFirstName("Kunal");
        a4.setLastName("Sen");
        a4.setEmail("kunal.sen@example.com");
        a4.setPhone("+919734567890");
        a4.setDateOfBirth(LocalDate.of(1994, 2, 17));
        a4.setAddressLine1("Block C-3, Salt Lake Sector V");
        a4.setAddressLine2("Near Webel");
        a4.setCity("Kolkata");
        a4.setState("West Bengal");
        a4.setPostalCode("700091");
        a4.setHousingStatus(ApplicantPersonalDetails.HousingStatusEnum.RENT);
        a4.setMonthlyHousingPayment(35000.0);
        app4.setApplicant(a4);

        Employment e4 = new Employment();
        e4.setEmployerName("Sen Independent Tech Consulting");
        e4.setJobTitle("Freelance Developer");
        e4.setEmploymentType(EmploymentDetails.EmploymentTypeEnum.CONTRACTOR);
        e4.setMonthlyGrossIncome(115000.0);
        e4.setMonthsAtCurrentEmployer(14);
        app4.setEmployment(e4);

        VehicleDetails v4 = new VehicleDetails();
        v4.setVehicleId("VEL-2026-M8");
        v4.setVin("WBSAE0C54NCH78901");
        v4.setMake("BMW");
        v4.setModel("M8 Competition");
        v4.setYear(2026);
        v4.setTrim("Gran Coupe");
        v4.setPurchasePrice(138800.0);
        app4.setVehicleDetails(v4);

        LoanTerms l4 = new LoanTerms();
        l4.setRequestedLoanAmount(110000.0);
        l4.setApprovedAmount(0.0);
        l4.setOfferedApr(11.75);
        l4.setTenureMonths(36);
        l4.setDownPayment(28800.0);
        app4.setLoanTerms(l4);

        ApplicationConsents c4 = new ApplicationConsents(true, true);
        app4.setConsents(c4);

        Instant t4 = Instant.parse("2026-03-12T09:45:00Z");
        app4.setSubmittedAt(t4);
        app4.setUpdatedAt(t4.plusSeconds(5400));

        List<DocumentMetadata> docs4 = new ArrayList<>();
        DocumentMetadata pan4 = new DocumentMetadata();
        pan4.setDocumentId("DOC-PAN-D404");
        pan4.setDocumentType(DocumentItem.DocumentTypeEnum.GOVERNMENT_ID);
        pan4.setFileName("kunal_pan.pdf");
        pan4.setStatus(DocumentItem.StatusEnum.VERIFIED);
        pan4.setUploadedAt(t4.atOffset(ZoneOffset.UTC));
        pan4.setVerifiedAt(t4.plusSeconds(1800).atOffset(ZoneOffset.UTC));
        docs4.add(pan4);
        app4.setRequiredDocuments(docs4);

        List<StatusAuditLog> hist4 = new ArrayList<>();
        hist4.add(new StatusAuditLog("SUBMITTED", t4.atOffset(ZoneOffset.UTC), "System", "Application submitted. Bureau score 635."));
        hist4.add(new StatusAuditLog("UNDER_REVIEW", t4.plusSeconds(1800).atOffset(ZoneOffset.UTC), "Priya Sharma (Senior Underwriter)", "Credit score below tier baseline (675). Debt-to-income calculated at 78%."));
        hist4.add(new StatusAuditLog("REJECTED", t4.plusSeconds(5400).atOffset(ZoneOffset.UTC), "Priya Sharma (Senior Underwriter)", "Application declined: high debt-to-income ratio, irregular contract income, and active unsecured loan defaults."));
        app4.setStatusHistory(hist4);
        apps.add(app4);

        // App 5: Prime+ (785) - SUBMITTED
        FinancingApplicationDocument app5 = new FinancingApplicationDocument();
        app5.setReferenceNumber("VEL-APP-2026-E505");
        app5.setStatus(ApplicationStatus.SUBMITTED);
        app5.setCibilScore(785);

        Applicant a5 = new Applicant();
        a5.setFirstName("Aditi");
        a5.setLastName("Rao");
        a5.setEmail("aditi.rao@example.com");
        a5.setPhone("+919845678901");
        a5.setDateOfBirth(LocalDate.of(1989, 7, 19));
        a5.setAddressLine1("Vasant Vihar, Block D");
        a5.setAddressLine2("Street 14");
        a5.setCity("New Delhi");
        a5.setState("Delhi");
        a5.setPostalCode("110057");
        a5.setHousingStatus(ApplicantPersonalDetails.HousingStatusEnum.OWN_OUTRIGHT);
        a5.setMonthlyHousingPayment(0.0);
        app5.setApplicant(a5);

        Employment e5 = new Employment();
        e5.setEmployerName("Google India Private Ltd");
        e5.setJobTitle("Group Product Manager");
        e5.setEmploymentType(EmploymentDetails.EmploymentTypeEnum.FULL_TIME);
        e5.setMonthlyGrossIncome(360000.0);
        e5.setMonthsAtCurrentEmployer(54);
        app5.setEmployment(e5);

        VehicleDetails v5 = new VehicleDetails();
        v5.setVehicleId("VEL-2026-RSETRON");
        v5.setVin("WAUZZZFW8NA009876");
        v5.setMake("Audi");
        v5.setModel("RS e-tron GT");
        v5.setYear(2026);
        v5.setTrim("Performance Edition");
        v5.setPurchasePrice(106500.0);
        app5.setVehicleDetails(v5);

        LoanTerms l5 = new LoanTerms();
        l5.setRequestedLoanAmount(85000.0);
        l5.setApprovedAmount(0.0);
        l5.setOfferedApr(8.65);
        l5.setTenureMonths(48);
        l5.setDownPayment(21500.0);
        app5.setLoanTerms(l5);

        ApplicationConsents c5 = new ApplicationConsents(true, true);
        c5.setContactViaSmsAccepted(true);
        app5.setConsents(c5);

        Instant t5 = Instant.parse("2026-03-15T16:20:00Z");
        app5.setSubmittedAt(t5);
        app5.setUpdatedAt(t5);

        List<DocumentMetadata> docs5 = new ArrayList<>();
        DocumentMetadata pan5 = new DocumentMetadata();
        pan5.setDocumentId("DOC-PAN-E505");
        pan5.setDocumentType(DocumentItem.DocumentTypeEnum.GOVERNMENT_ID);
        pan5.setFileName("aditi_pan.pdf");
        pan5.setStatus(DocumentItem.StatusEnum.PENDING);
        pan5.setUploadedAt(t5.atOffset(ZoneOffset.UTC));
        docs5.add(pan5);
        app5.setRequiredDocuments(docs5);

        List<StatusAuditLog> hist5 = new ArrayList<>();
        hist5.add(new StatusAuditLog("SUBMITTED", t5.atOffset(ZoneOffset.UTC), "System", "Application received. Pre-qualification score 785. Awaiting underwriter review."));
        app5.setStatusHistory(hist5);
        apps.add(app5);

        financingApplicationRepository.saveAll(apps);
        log.info("Successfully seeded {} financing applications.", apps.size());
    }

    private void seedEnquiries() {
        List<EnquiryDocument> enquiries = new ArrayList<>();
        Instant now = Instant.now();

        // Enquiry 1: PRICE_QUOTE - NEW
        EnquiryDocument enq1 = new EnquiryDocument();
        enq1.setReferenceTicket("VEL-ENQ-2026-0001");
        enq1.setEnquiryType("PRICE_QUOTE");
        enq1.setStatus(EnquiryStatus.NEW);

        CustomerContact c1 = new CustomerContact();
        c1.setFirstName("Rahul");
        c1.setLastName("Sharma");
        c1.setEmail("rahul.sharma@example.com");
        c1.setPhone("+919876501234");
        c1.setPreferredContactMethod(CustomerContact.PreferredContactMethodEnum.EMAIL);
        enq1.setCustomer(c1);

        VehicleReference vr1 = new VehicleReference();
        vr1.setVehicleId("VEL-2026-GT");
        vr1.setMake("Mercedes-AMG");
        vr1.setModel("GT 4-Door Coupe");
        vr1.setYear(2026);
        enq1.setVehicleReference(vr1);

        enq1.setPreferredTimeSlot("MORNING");
        enq1.setPostalCode("110001");
        enq1.setMessage("Interested in complete on-road price breakdown including luxury cess and corporate tax depreciation benefits in Delhi NCR.");
        enq1.setCreatedAt(now.minusSeconds(172800));
        enq1.setUpdatedAt(now.minusSeconds(172800));
        enquiries.add(enq1);

        // Enquiry 2: FINANCE_ASSISTANCE - IN_PROGRESS
        EnquiryDocument enq2 = new EnquiryDocument();
        enq2.setReferenceTicket("VEL-ENQ-2026-0002");
        enq2.setEnquiryType("FINANCE_ASSISTANCE");
        enq2.setStatus(EnquiryStatus.IN_PROGRESS);
        enq2.setAssignedAdvisor("Sameer Joshi");

        CustomerContact c2 = new CustomerContact();
        c2.setFirstName("Ananya");
        c2.setLastName("Deshmukh");
        c2.setEmail("ananya.d@example.com");
        c2.setPhone("+919811223344");
        c2.setPreferredContactMethod(CustomerContact.PreferredContactMethodEnum.PHONE);
        enq2.setCustomer(c2);

        VehicleReference vr2 = new VehicleReference();
        vr2.setVehicleId("VEL-2026-TAYCAN");
        vr2.setMake("Porsche");
        vr2.setModel("Taycan");
        vr2.setYear(2026);
        enq2.setVehicleReference(vr2);

        enq2.setPreferredTimeSlot("AFTERNOON");
        enq2.setPostalCode("400001");
        enq2.setMessage("Looking for structured 5-year balloon repayment schedules with buyback guarantee.");
        enq2.setResolutionNotes(new ArrayList<>(List.of("Senior Advisor Sameer Joshi reached out on phone. Customized balloon quote generated and emailed.")));
        enq2.setCreatedAt(now.minusSeconds(86400));
        enq2.setUpdatedAt(now.minusSeconds(3600));
        enquiries.add(enq2);

        // Enquiry 3: TRADE_IN - CONTACTED
        EnquiryDocument enq3 = new EnquiryDocument();
        enq3.setReferenceTicket("VEL-ENQ-2026-0003");
        enq3.setEnquiryType("TRADE_IN");
        enq3.setStatus(EnquiryStatus.CONTACTED);
        enq3.setAssignedAdvisor("Deepak Malik");

        CustomerContact c3 = new CustomerContact();
        c3.setFirstName("Varun");
        c3.setLastName("Khanna");
        c3.setEmail("varun.khanna@example.com");
        c3.setPhone("+919988776655");
        c3.setPreferredContactMethod(CustomerContact.PreferredContactMethodEnum.WHATSAPP);
        enq3.setCustomer(c3);

        VehicleReference vr3 = new VehicleReference();
        vr3.setVehicleId("VEL-2026-M8");
        vr3.setMake("BMW");
        vr3.setModel("M8 Competition");
        vr3.setYear(2026);
        enq3.setVehicleReference(vr3);

        enq3.setPreferredTimeSlot("EVENING");
        enq3.setPostalCode("560025");
        enq3.setMessage("Seeking trade-in valuation for 2023 BMW 530d M Sport against new M8 Competition purchase.");
        enq3.setResolutionNotes(new ArrayList<>(List.of(
                "Inspection completed at Velora Bengaluru lounge.",
                "Trade-in exchange valuation finalized at Rs 54,00,000 credit towards M8."
        )));
        enq3.setCreatedAt(now.minusSeconds(259200));
        enq3.setUpdatedAt(now.minusSeconds(43200));
        enquiries.add(enq3);

        // Enquiry 4: GENERAL - CONVERTED
        EnquiryDocument enq4 = new EnquiryDocument();
        enq4.setReferenceTicket("VEL-ENQ-2026-0004");
        enq4.setEnquiryType("GENERAL");
        enq4.setStatus(EnquiryStatus.CONVERTED);
        enq4.setAssignedAdvisor("Ananya Sen");

        CustomerContact c4 = new CustomerContact();
        c4.setFirstName("Pooja");
        c4.setLastName("Nair");
        c4.setEmail("pooja.nair@example.com");
        c4.setPhone("+919912345670");
        c4.setPreferredContactMethod(CustomerContact.PreferredContactMethodEnum.EMAIL);
        enq4.setCustomer(c4);

        VehicleReference vr4 = new VehicleReference();
        vr4.setVehicleId("VEL-2026-DB12");
        vr4.setMake("Aston Martin");
        vr4.setModel("DB12");
        vr4.setYear(2026);
        enq4.setVehicleReference(vr4);

        enq4.setPreferredTimeSlot("ANYTIME");
        enq4.setPostalCode("600004");
        enq4.setMessage("Inquiring about bespoke paint palette options (Q by Aston Martin) and import lead time.");
        enq4.setResolutionNotes(new ArrayList<>(List.of("Sent bespoke personalization PDF and confirmed 14-week delivery window.")));
        enq4.setCreatedAt(now.minusSeconds(432000));
        enq4.setUpdatedAt(now.minusSeconds(172800));
        enquiries.add(enq4);

        enquiryRepository.saveAll(enquiries);
        log.info("Successfully seeded {} enquiries.", enquiries.size());
    }

    private void seedTestDriveBookings() {
        List<TestDriveBookingDocument> bookings = new ArrayList<>();
        Instant now = Instant.now();

        // Booking 1: CONFIRMED
        TestDriveBookingDocument td1 = new TestDriveBookingDocument();
        td1.setConfirmationCode("VEL-DRIVE-2026-101");
        td1.setVehicleId("VEL-2026-GT");
        td1.setStatus("CONFIRMED");
        td1.setPreferredDate(LocalDate.now().plusDays(2));
        td1.setPreferredTimeSlot("11:00 AM - 12:30 PM");
        td1.setDealershipLocation("Velora Experience Center, Aerocity, New Delhi");
        td1.setDriverLicenseValid(true);
        td1.setNotes("Customer interested in track dynamic drive and AMG Ride Control demonstration.");

        CustomerContact c1 = new CustomerContact();
        c1.setFirstName("Arjun");
        c1.setLastName("Mehta");
        c1.setEmail("arjun.mehta@example.com");
        c1.setPhone("+919876543210");
        td1.setCustomer(c1);

        td1.setScheduledDateTime(OffsetDateTime.now(ZoneOffset.UTC).plusDays(2));
        td1.setCreatedAt(now.minusSeconds(86400));
        bookings.add(td1);

        // Booking 2: COMPLETED
        TestDriveBookingDocument td2 = new TestDriveBookingDocument();
        td2.setConfirmationCode("VEL-DRIVE-2026-102");
        td2.setVehicleId("VEL-2026-TAYCAN");
        td2.setStatus("COMPLETED");
        td2.setPreferredDate(LocalDate.now().minusDays(2));
        td2.setPreferredTimeSlot("03:00 PM - 04:30 PM");
        td2.setDealershipLocation("Velora Flagship Lounge, Worli, Mumbai");
        td2.setDriverLicenseValid(true);
        td2.setNotes("Sea Link trial drive completed. Applicant was thrilled with launch control.");

        CustomerContact c2 = new CustomerContact();
        c2.setFirstName("Rohan");
        c2.setLastName("Gupta");
        c2.setEmail("rohan.gupta@example.com");
        c2.setPhone("+919812345678");
        td2.setCustomer(c2);

        td2.setScheduledDateTime(OffsetDateTime.now(ZoneOffset.UTC).minusDays(2));
        td2.setCreatedAt(now.minusSeconds(259200));
        bookings.add(td2);

        // Booking 3: RESCHEDULED
        TestDriveBookingDocument td3 = new TestDriveBookingDocument();
        td3.setConfirmationCode("VEL-DRIVE-2026-103");
        td3.setVehicleId("VEL-2026-DB12");
        td3.setStatus("RESCHEDULED");
        td3.setPreferredDate(LocalDate.now().plusDays(5));
        td3.setPreferredTimeSlot("04:30 PM - 06:00 PM");
        td3.setDealershipLocation("Velora Studio, UB City, Bengaluru");
        td3.setDriverLicenseValid(true);
        td3.setNotes("Rescheduled at client request due to corporate travel.");

        CustomerContact c3 = new CustomerContact();
        c3.setFirstName("Sneha");
        c3.setLastName("Patel");
        c3.setEmail("sneha.patel@example.com");
        c3.setPhone("+919923456789");
        td3.setCustomer(c3);

        td3.setScheduledDateTime(OffsetDateTime.now(ZoneOffset.UTC).plusDays(5));
        td3.setCreatedAt(now.minusSeconds(172800));
        bookings.add(td3);

        // Booking 4: CANCELLED
        TestDriveBookingDocument td4 = new TestDriveBookingDocument();
        td4.setConfirmationCode("VEL-DRIVE-2026-104");
        td4.setVehicleId("VEL-2026-M8");
        td4.setStatus("CANCELLED");
        td4.setPreferredDate(LocalDate.now().minusDays(4));
        td4.setPreferredTimeSlot("01:00 PM - 02:30 PM");
        td4.setDealershipLocation("Velora Lounge, Park Street, Kolkata");
        td4.setDriverLicenseValid(false);
        td4.setNotes("Cancelled as client's commercial international driver permit was pending endorsement.");

        CustomerContact c4 = new CustomerContact();
        c4.setFirstName("Kunal");
        c4.setLastName("Sen");
        c4.setEmail("kunal.sen@example.com");
        c4.setPhone("+919734567890");
        td4.setCustomer(c4);

        td4.setScheduledDateTime(OffsetDateTime.now(ZoneOffset.UTC).minusDays(4));
        td4.setCreatedAt(now.minusSeconds(345600));
        bookings.add(td4);

        testDriveBookingRepository.saveAll(bookings);
        log.info("Successfully seeded {} test drive bookings.", bookings.size());
    }
}
