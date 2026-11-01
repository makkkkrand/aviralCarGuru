package com.aviral.carguru.service;

import com.aviral.carguru.document.*;
import com.aviral.carguru.model.*;
import com.aviral.carguru.repository.EnquiryRepository;
import com.aviral.carguru.repository.FinancingApplicationRepository;
import com.aviral.carguru.repository.TestDriveBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class FinancingService {

    private final FinancingApplicationRepository applicationRepository;
    private final EnquiryRepository enquiryRepository;
    private final TestDriveBookingRepository testDriveBookingRepository;
    private final MongoTemplate mongoTemplate;

    public FinancingService(FinancingApplicationRepository applicationRepository,
                            EnquiryRepository enquiryRepository,
                            TestDriveBookingRepository testDriveBookingRepository) {
        this(applicationRepository, enquiryRepository, testDriveBookingRepository, null);
    }

    @Autowired
    public FinancingService(FinancingApplicationRepository applicationRepository,
                            EnquiryRepository enquiryRepository,
                            TestDriveBookingRepository testDriveBookingRepository,
                            @Autowired(required = false) MongoTemplate mongoTemplate) {
        this.applicationRepository = applicationRepository;
        this.enquiryRepository = enquiryRepository;
        this.testDriveBookingRepository = testDriveBookingRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public LoanCalculationResponse calculateLoan(LoanCalculationRequest request) {
        double price = request.getVehiclePrice();
        double downPayment = request.getDownPayment();
        double tradeIn = request.getTradeInValue() != null ? request.getTradeInValue() : 0.0;
        double taxRate = request.getSalesTaxRate() != null ? request.getSalesTaxRate() : 7.0;
        double apr = request.getInterestRateAnnual();
        int months = request.getTenureMonths();

        double totalSalesTax = Math.round((price * (taxRate / 100.0)) * 100.0) / 100.0;
        double netCapitalizedCost = Math.max(0.0, price + totalSalesTax - downPayment - tradeIn);
        netCapitalizedCost = Math.round(netCapitalizedCost * 100.0) / 100.0;

        double monthlyPayment;
        double totalInterest;
        double totalCost;

        if (netCapitalizedCost <= 0) {
            monthlyPayment = 0.0;
            totalInterest = 0.0;
            totalCost = price + totalSalesTax;
        } else if (apr <= 0.0) {
            monthlyPayment = Math.round((netCapitalizedCost / months) * 100.0) / 100.0;
            totalInterest = 0.0;
            totalCost = netCapitalizedCost;
        } else {
            double monthlyRate = (apr / 100.0) / 12.0;
            double factor = Math.pow(1.0 + monthlyRate, months);
            monthlyPayment = netCapitalizedCost * (monthlyRate * factor) / (factor - 1.0);
            monthlyPayment = Math.round(monthlyPayment * 100.0) / 100.0;

            totalCost = Math.round((monthlyPayment * months) * 100.0) / 100.0;
            totalInterest = Math.max(0.0, Math.round((totalCost - netCapitalizedCost) * 100.0) / 100.0);
        }

        List<AmortizationYear> schedule = new ArrayList<>();
        double remainingBalance = netCapitalizedCost;
        double monthlyRate = (apr / 100.0) / 12.0;
        int totalYears = (int) Math.ceil((double) months / 12.0);

        for (int y = 1; y <= totalYears; y++) {
            double yearPrincipal = 0.0;
            double yearInterest = 0.0;
            int monthsInThisYear = Math.min(12, months - (y - 1) * 12);

            for (int m = 1; m <= monthsInThisYear; m++) {
                double interestForMonth = remainingBalance * monthlyRate;
                double principalForMonth = Math.min(remainingBalance, monthlyPayment - interestForMonth);
                yearInterest += interestForMonth;
                yearPrincipal += principalForMonth;
                remainingBalance = Math.max(0.0, remainingBalance - principalForMonth);
            }

            AmortizationYear item = new AmortizationYear();
            item.setYear(y);
            item.setPrincipalPaid(Math.round(yearPrincipal * 100.0) / 100.0);
            item.setInterestPaid(Math.round(yearInterest * 100.0) / 100.0);
            item.setRemainingBalance(Math.round(remainingBalance * 100.0) / 100.0);
            schedule.add(item);
        }

        LoanCalculationResponse response = new LoanCalculationResponse();
        response.setVehiclePrice(price);
        response.setDownPayment(downPayment);
        response.setTradeInValue(tradeIn);
        response.setTotalSalesTax(totalSalesTax);
        response.setNetCapitalizedCost(netCapitalizedCost);
        response.setMonthlyPayment(monthlyPayment);
        response.setTotalInterest(totalInterest);
        response.setTotalCost(totalCost);
        response.setTenureMonths(months);
        response.setInterestRateAnnual(apr);
        response.setAmortizationSchedule(schedule);

        return response;
    }

    public FinanceOptionsResponse getFinancingOptions(String creditTier) {
        FinanceOptionsResponse response = new FinanceOptionsResponse();
        response.setTenureOptionsMonths(List.of(24, 36, 48, 60, 72, 84));
        response.setMinDownPaymentPercentage(10.0);

        List<InterestRateTier> tiers = new ArrayList<>();
        InterestRateTier t1 = new InterestRateTier();
        t1.setCreditTier(InterestRateTier.CreditTierEnum.EXCELLENT);
        t1.setAprFrom(3.99);
        t1.setAprTo(4.99);
        t1.setDescription("Score 750+ (Prime Luxury Tier)");
        tiers.add(t1);

        InterestRateTier t2 = new InterestRateTier();
        t2.setCreditTier(InterestRateTier.CreditTierEnum.GOOD);
        t2.setAprFrom(5.49);
        t2.setAprTo(6.99);
        t2.setDescription("Score 700 - 749 (Standard Preferred)");
        tiers.add(t2);

        InterestRateTier t3 = new InterestRateTier();
        t3.setCreditTier(InterestRateTier.CreditTierEnum.FAIR);
        t3.setAprFrom(7.49);
        t3.setAprTo(9.99);
        t3.setDescription("Score 640 - 699");
        tiers.add(t3);

        InterestRateTier t4 = new InterestRateTier();
        t4.setCreditTier(InterestRateTier.CreditTierEnum.REBUILDING);
        t4.setAprFrom(10.99);
        t4.setAprTo(14.99);
        t4.setDescription("Credit Building & First-Time Buyers");
        tiers.add(t4);

        response.setInterestRateTiers(tiers);
        return response;
    }

    public PreQualificationResponse submitPreQualification(PreQualificationRequest request) {
        double income = request.getAnnualIncome();
        double desiredLoan = request.getDesiredLoanAmount();

        double maxLoan = Math.round((income * 0.75) * 100.0) / 100.0;
        boolean eligible = desiredLoan <= maxLoan;

        PreQualificationResponse res = new PreQualificationResponse();
        res.setIsEligible(eligible);
        res.setMaxEligibleAmount(maxLoan);
        res.setEstimatedAprFrom(3.99);
        res.setEstimatedAprTo(5.99);
        res.setPreApprovalReferenceCode("VEL-PRE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        res.setValidUntil(LocalDate.now().plusDays(30));
        return res;
    }

    public FinancingApplicationResponse submitFinancingApplication(FinancingApplicationRequest request) {
        FinancingApplicationDocument doc = new FinancingApplicationDocument();
        String ref = "VEL-APP-" + LocalDate.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        doc.setReferenceNumber(ref);
        doc.setStatus(ApplicationStatus.SUBMITTED);
        Instant now = Instant.now();
        doc.setSubmittedAt(now);
        doc.setUpdatedAt(now);
        doc.setCibilScore(750);
        doc.setApplicant(request.getApplicant());
        doc.setEmployment(request.getEmployment());
        doc.setVehicleDetails(request.getVehicleDetails());
        doc.setLoanTerms(request.getLoanTerms());
        doc.setConsents(request.getConsents());

        List<DocumentMetadata> docs = new ArrayList<>();
        DocumentMetadata idDoc = new DocumentMetadata();
        idDoc.setDocumentId("DOC-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        idDoc.setDocumentType(DocumentItem.DocumentTypeEnum.GOVERNMENT_ID);
        idDoc.setStatus(DocumentItem.StatusEnum.PENDING);
        docs.add(idDoc);

        DocumentMetadata payDoc = new DocumentMetadata();
        payDoc.setDocumentId("DOC-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        payDoc.setDocumentType(DocumentItem.DocumentTypeEnum.PAY_SLIP);
        payDoc.setStatus(DocumentItem.StatusEnum.PENDING);
        docs.add(payDoc);

        doc.setRequiredDocuments(docs);

        List<StatusAuditLog> history = new ArrayList<>();
        StatusAuditLog init = new StatusAuditLog(
                "SUBMITTED",
                now.atOffset(ZoneOffset.UTC),
                "System",
                "Financing application submitted through Velora Portal. Under automated underwriter review."
        );
        history.add(init);
        doc.setStatusHistory(history);

        FinancingApplicationDocument saved = applicationRepository.save(doc);

        FinancingApplicationResponse response = new FinancingApplicationResponse();
        response.setApplicationId(saved.getId());
        response.setReferenceNumber(saved.getReferenceNumber());
        response.setStatus(FinancingApplicationResponse.StatusEnum.SUBMITTED);
        response.setSubmittedAt(saved.getSubmittedAtAsOffsetDateTime());
        response.setEstimatedDecisionDate(LocalDate.now().plusDays(2));
        return response;
    }

    public FinancingApplicationsListResponse listApplications(String status, String employmentType, String search) {
        return listApplications(status, employmentType, search, Pageable.unpaged());
    }

    public FinancingApplicationsListResponse listApplications(String status, String employmentType, String search, Pageable pageable) {
        List<FinancingApplicationDocument> docs = applicationRepository.findApplicationsWithDynamicFilter(status, employmentType, search, pageable);
        long totalCount = applicationRepository.countApplicationsWithDynamicFilter(status, employmentType, search);

        List<FinancingApplicationDetail> details = docs.stream().map(this::mapToDetail).toList();

        FinancingApplicationsListResponse response = new FinancingApplicationsListResponse();
        response.setTotalCount((int) totalCount);
        response.setTotal((int) totalCount);
        response.setApplications(details);
        return response;
    }

    public Optional<FinancingApplicationDetail> getFinancingApplication(String applicationId, String applicantEmail) {
        Optional<FinancingApplicationDocument> opt = findApplicationByIdOrReference(applicationId);

        return opt.filter(d -> {
            if (applicantEmail != null && !applicantEmail.isBlank()) {
                return d.getApplicant() != null && applicantEmail.equalsIgnoreCase(d.getApplicant().getEmail());
            }
            return true;
        }).map(this::mapToDetail);
    }

    public Optional<FinancingApplicationDetail> reviewApplication(String applicationId, UnderwritingReviewRequest review) {
        Optional<FinancingApplicationDocument> opt = findApplicationByIdOrReference(applicationId);
        if (opt.isEmpty()) {
            return Optional.empty();
        }

        FinancingApplicationDocument doc = opt.get();
        Instant now = Instant.now();
        doc.setUpdatedAt(now);

        String newStatusStr = review.getStatus() != null ? review.getStatus().getValue() : doc.getStatusValue();
        doc.setStatus(newStatusStr);

        if (doc.getLoanTerms() != null) {
            if (review.getApprovedAmount() != null) {
                doc.getLoanTerms().setApprovedAmount(review.getApprovedAmount().doubleValue());
            }
            if (review.getOfferedApr() != null) {
                doc.getLoanTerms().setOfferedApr(review.getOfferedApr().doubleValue());
            }
        }

        String author = review.getUnderwriterName() != null && !review.getUnderwriterName().isBlank()
                ? review.getUnderwriterName()
                : "Velora Senior Underwriter";

        String note = review.getNote() != null && !review.getNote().isBlank()
                ? review.getNote()
                : "Application status updated to " + newStatusStr;

        StatusAuditLog auditLog = new StatusAuditLog(
                newStatusStr,
                now.atOffset(ZoneOffset.UTC),
                author,
                note
        );

        if (doc.getStatusHistory() == null) {
            doc.setStatusHistory(new ArrayList<>());
        }
        doc.getStatusHistory().add(auditLog);

        FinancingApplicationDocument saved = applicationRepository.save(doc);
        return Optional.of(mapToDetail(saved));
    }

    public Optional<ApplicationDocument> verifyDocument(String applicationId, String documentId, DocumentVerificationRequest request) {
        String targetStatus = request != null && request.getStatus() != null
                ? request.getStatus().getValue()
                : "VERIFIED";
        return verifyDocument(applicationId, documentId, targetStatus);
    }

    public Optional<ApplicationDocument> verifyDocument(String applicationId, String documentId, String status) {
        Optional<FinancingApplicationDocument> opt = findApplicationByIdOrReference(applicationId);
        if (opt.isEmpty()) {
            return Optional.empty();
        }

        FinancingApplicationDocument doc = opt.get();
        Instant now = Instant.now();
        doc.setUpdatedAt(now);

        String targetStatus = status != null ? status.toUpperCase() : "VERIFIED";

        DocumentMetadata matchedDoc = null;
        if (doc.getRequiredDocuments() != null) {
            for (DocumentMetadata item : doc.getRequiredDocuments()) {
                if (item.getDocumentId() != null && item.getDocumentId().equalsIgnoreCase(documentId)) {
                    item.setStatus(DocumentItem.StatusEnum.fromValue(targetStatus));
                    item.setVerifiedAt(now.atOffset(ZoneOffset.UTC));
                    matchedDoc = item;
                    break;
                }
            }
        }

        if (matchedDoc == null) {
            return Optional.empty();
        }

        String docTypeName = matchedDoc.getDocumentType() != null ? matchedDoc.getDocumentType().getValue() : "Document";
        StatusAuditLog auditLog = new StatusAuditLog(
                "DOC_VERIFICATION",
                now.atOffset(ZoneOffset.UTC),
                "Risk Compliance Underwriter",
                "Document " + docTypeName + " marked as " + targetStatus
        );

        if (doc.getStatusHistory() == null) {
            doc.setStatusHistory(new ArrayList<>());
        }
        doc.getStatusHistory().add(auditLog);

        applicationRepository.save(doc);
        return Optional.of(matchedDoc.toApplicationDocument());
    }

    public Optional<DocumentSubmissionResponse> uploadApplicationDocument(String applicationId, DocumentSubmissionRequest request) {
        Optional<FinancingApplicationDocument> opt = findApplicationByIdOrReference(applicationId);
        if (opt.isEmpty()) {
            return Optional.empty();
        }

        FinancingApplicationDocument doc = opt.get();
        Instant now = Instant.now();
        doc.setUpdatedAt(now);

        String docId = "DOC-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        DocumentMetadata item = new DocumentMetadata();
        item.setDocumentId(docId);
        item.setDocumentType(DocumentItem.DocumentTypeEnum.fromValue(request.getDocumentType().getValue()));
        item.setFileName(request.getFileName());
        item.setStatus(DocumentItem.StatusEnum.UPLOADED);
        item.setUploadedAt(now.atOffset(ZoneOffset.UTC));

        if (doc.getRequiredDocuments() == null) {
            doc.setRequiredDocuments(new ArrayList<>());
        }
        doc.getRequiredDocuments().removeIf(d -> d.getDocumentType() != null && d.getDocumentType().getValue().equals(request.getDocumentType().getValue()));
        doc.getRequiredDocuments().add(item);

        StatusAuditLog updateNote = new StatusAuditLog(
                "DOCUMENT_UPLOADED",
                now.atOffset(ZoneOffset.UTC),
                "Applicant",
                "Uploaded " + request.getDocumentType() + " (" + request.getFileName() + ")."
        );
        if (doc.getStatusHistory() == null) {
            doc.setStatusHistory(new ArrayList<>());
        }
        doc.getStatusHistory().add(updateNote);

        applicationRepository.save(doc);

        DocumentSubmissionResponse res = new DocumentSubmissionResponse();
        res.setDocumentId(docId);
        res.setDocumentType(request.getDocumentType().getValue());
        res.setFileName(request.getFileName());
        res.setStatus("UPLOADED");
        res.setUploadTimestamp(now.atOffset(ZoneOffset.UTC));
        return Optional.of(res);
    }

    public PortfolioSummaryResponse getPortfolioSummary() {
        if (mongoTemplate != null) {
            try {
                Aggregation agg = Aggregation.newAggregation(
                        Aggregation.project("status", "cibilScore")
                                .and("loanTerms.requestedLoanAmount").as("requestedLoanAmount")
                                .and("loanTerms.approvedAmount").as("approvedAmount")
                                .and("employment.employmentType").as("employmentType")
                                .and("submittedAt").as("submittedAt"),
                        Aggregation.group("status")
                                .count().as("count")
                                .sum("requestedLoanAmount").as("totalRequested")
                                .sum("approvedAmount").as("totalApproved")
                );
                AggregationResults<Map> results = mongoTemplate.aggregate(agg, "financing_applications", Map.class);
            } catch (Exception ignored) {
                // Graceful fallback
            }
        }

        List<FinancingApplicationDocument> allApps = applicationRepository.findAll();
        long activeEnquiries = enquiryRepository.count();
        long scheduledTestDrives = testDriveBookingRepository.count();

        double totalRequestedVolume = 0.0;
        double totalApprovedVolume = 0.0;
        int approvedCount = 0;
        int underReviewCount = 0;
        int docsRequiredCount = 0;
        int rejectedCount = 0;

        int primePlusCount = 0;  // 775+
        int primeCount = 0;      // 725-774
        int fairCount = 0;       // 675-724
        int subprimeCount = 0;   // <675

        Map<String, Integer> employmentCounts = new LinkedHashMap<>();
        employmentCounts.put("FULL_TIME", 0);
        employmentCounts.put("SELF_EMPLOYED", 0);
        employmentCounts.put("BUSINESS_OWNER", 0);
        employmentCounts.put("CONTRACTOR", 0);

        Map<String, Double> monthlyVolumes = new TreeMap<>();
        Map<String, Integer> monthlyApprovals = new TreeMap<>();
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM yyyy", Locale.ENGLISH);

        for (FinancingApplicationDocument app : allApps) {
            double reqAmount = 0.0;
            double appAmount = 0.0;
            if (app.getLoanTerms() != null) {
                if (app.getLoanTerms().getRequestedLoanAmount() != null) {
                    reqAmount = app.getLoanTerms().getRequestedLoanAmount();
                }
                if (app.getLoanTerms().getApprovedAmount() != null) {
                    appAmount = app.getLoanTerms().getApprovedAmount();
                }
            }
            totalRequestedVolume += reqAmount;

            String status = app.getStatusValue() != null ? app.getStatusValue().toUpperCase() : "SUBMITTED";
            if ("APPROVED".equals(status)) {
                approvedCount++;
                totalApprovedVolume += (appAmount > 0.0 ? appAmount : reqAmount);
            } else if ("UNDER_REVIEW".equals(status)) {
                underReviewCount++;
            } else if ("DOCS_REQUIRED".equals(status) || "NEEDS_DOCUMENTS".equals(status)) {
                docsRequiredCount++;
            } else if ("REJECTED".equals(status)) {
                rejectedCount++;
            }

            int score = app.getCibilScore() != null ? app.getCibilScore() : 750;
            if (score >= 775) {
                primePlusCount++;
            } else if (score >= 725) {
                primeCount++;
            } else if (score >= 675) {
                fairCount++;
            } else {
                subprimeCount++;
            }

            String empType = "FULL_TIME";
            if (app.getEmployment() != null && app.getEmployment().getEmploymentType() != null) {
                empType = app.getEmployment().getEmploymentType().getValue();
            }
            employmentCounts.put(empType, employmentCounts.getOrDefault(empType, 0) + 1);

            Instant subInstant = app.getSubmittedAt() != null ? app.getSubmittedAt() : Instant.now();
            String monthKey = monthFormatter.format(subInstant.atOffset(ZoneOffset.UTC));
            monthlyVolumes.put(monthKey, monthlyVolumes.getOrDefault(monthKey, 0.0) + reqAmount);
            if ("APPROVED".equals(status)) {
                monthlyApprovals.put(monthKey, monthlyApprovals.getOrDefault(monthKey, 0) + 1);
            }
        }

        int totalApps = allApps.size();
        double approvalRate = totalApps > 0 ? Math.round(((double) approvedCount / totalApps) * 100.0) : 0.0;
        double avgTicketSize = totalApps > 0 ? Math.round(totalRequestedVolume / totalApps) : 0.0;

        PortfolioKpis kpis = new PortfolioKpis();
        kpis.setTotalApplications(totalApps);
        kpis.setTotalRequestedVolume(BigDecimal.valueOf(Math.round(totalRequestedVolume * 100.0) / 100.0));
        kpis.setTotalApprovedVolume(BigDecimal.valueOf(Math.round(totalApprovedVolume * 100.0) / 100.0));
        kpis.setApprovalRate(BigDecimal.valueOf(approvalRate));
        kpis.setAvgTicketSize(BigDecimal.valueOf(avgTicketSize));
        kpis.setActiveEnquiries((int) activeEnquiries);
        kpis.setScheduledTestDrives((int) scheduledTestDrives);
        kpis.setPendingReviewsCount(underReviewCount + docsRequiredCount);
        kpis.setUnderReviewCount(underReviewCount);
        kpis.setDocsRequiredCount(docsRequiredCount);
        kpis.setApprovedCount(approvedCount);
        kpis.setRejectedCount(rejectedCount);

        List<CibilDistributionItem> cibilDistribution = List.of(
                createCibilItem("Prime+ (775+)", primePlusCount, "0.4%", totalApps > 0 ? Math.round(((double) primePlusCount / totalApps) * 100.0) : 0.0),
                createCibilItem("Prime (725-774)", primeCount, "1.2%", totalApps > 0 ? Math.round(((double) primeCount / totalApps) * 100.0) : 0.0),
                createCibilItem("Fair (675-724)", fairCount, "3.1%", totalApps > 0 ? Math.round(((double) fairCount / totalApps) * 100.0) : 0.0),
                createCibilItem("Subprime (<675)", subprimeCount, "7.8%", totalApps > 0 ? Math.round(((double) subprimeCount / totalApps) * 100.0) : 0.0)
        );

        List<EmploymentDistributionItem> employmentDistribution = employmentCounts.entrySet().stream()
                .map(e -> {
                    EmploymentDistributionItem item = new EmploymentDistributionItem();
                    item.setName(e.getKey());
                    item.setCount(e.getValue());
                    item.setPercentage(BigDecimal.valueOf(totalApps > 0 ? Math.round(((double) e.getValue() / totalApps) * 100.0) : 0.0));
                    return item;
                })
                .toList();

        List<MonthlyVolumeHistoryItem> monthlyVolumeHistory = monthlyVolumes.entrySet().stream()
                .map(e -> {
                    MonthlyVolumeHistoryItem item = new MonthlyVolumeHistoryItem();
                    item.setMonth(e.getKey());
                    item.setVolume(BigDecimal.valueOf(Math.round(e.getValue() * 100.0) / 100.0));
                    item.setVolumeCr(BigDecimal.valueOf(Math.round((e.getValue() / 10000000.0) * 100.0) / 100.0));
                    item.setApprovals(monthlyApprovals.getOrDefault(e.getKey(), 0));
                    return item;
                })
                .toList();

        PortfolioSummaryResponse summary = new PortfolioSummaryResponse();
        summary.setKpis(kpis);
        summary.setCibilDistribution(cibilDistribution);
        summary.setEmploymentDistribution(employmentDistribution);
        summary.setMonthlyVolumeHistory(monthlyVolumeHistory);

        return summary;
    }

    private CibilDistributionItem createCibilItem(String tier, int count, String defaultRateEst, double percentage) {
        CibilDistributionItem item = new CibilDistributionItem();
        item.setTier(tier);
        item.setCount(count);
        item.setDefaultRateEst(defaultRateEst);
        item.setPercentage(BigDecimal.valueOf(percentage));
        return item;
    }

    private Optional<FinancingApplicationDocument> findApplicationByIdOrReference(String identifier) {
        if (identifier == null || identifier.isBlank()) {
            return Optional.empty();
        }
        Optional<FinancingApplicationDocument> opt = applicationRepository.findById(identifier);
        if (opt.isEmpty()) {
            opt = applicationRepository.findByReferenceNumberIgnoreCase(identifier);
        }
        return opt;
    }

    private FinancingApplicationDetail mapToDetail(FinancingApplicationDocument d) {
        FinancingApplicationDetail detail = new FinancingApplicationDetail();
        detail.setApplicationId(d.getId());
        detail.setReferenceNumber(d.getReferenceNumber());

        String statusStr = d.getStatusValue();
        if (statusStr != null) {
            try {
                detail.setStatus(FinancingApplicationDetail.StatusEnum.fromValue(statusStr));
            } catch (IllegalArgumentException e) {
                detail.setStatus(FinancingApplicationDetail.StatusEnum.SUBMITTED);
            }
        }

        detail.setSubmittedAt(d.getSubmittedAtAsOffsetDateTime());
        detail.setUpdatedAt(d.getUpdatedAtAsOffsetDateTime());
        detail.setCibilScore(d.getCibilScore());
        detail.setApplicant(d.getApplicant());
        detail.setEmployment(d.getEmployment());
        detail.setVehicleDetails(d.getVehicleDetails());
        detail.setLoanTerms(d.getLoanTerms());
        detail.setRequiredDocuments(d.getRequiredDocuments() != null ? new ArrayList<>(d.getRequiredDocuments()) : new ArrayList<>());
        detail.setStatusHistory(d.getStatusHistory() != null ? new ArrayList<>(d.getStatusHistory()) : new ArrayList<>());
        return detail;
    }
}
