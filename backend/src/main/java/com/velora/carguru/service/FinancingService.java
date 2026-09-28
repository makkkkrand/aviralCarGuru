package com.velora.carguru.service;

import com.velora.carguru.document.FinancingApplicationDocument;
import com.velora.carguru.model.*;
import com.velora.carguru.repository.FinancingApplicationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.*;

@Service
public class FinancingService {

    private final FinancingApplicationRepository applicationRepository;

    public FinancingService(FinancingApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
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

        // Build annual amortization schedule
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

        // Conservative DTI luxury qualification logic
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
        doc.setStatus("SUBMITTED");
        doc.setSubmittedAt(OffsetDateTime.now());
        doc.setApplicant(request.getApplicant());
        doc.setEmployment(request.getEmployment());
        doc.setVehicleDetails(request.getVehicleDetails());
        doc.setLoanTerms(request.getLoanTerms());
        doc.setConsents(request.getConsents());

        // Default required documents
        List<DocumentItem> docs = new ArrayList<>();
        DocumentItem idDoc = new DocumentItem();
        idDoc.setDocumentId("DOC-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        idDoc.setDocumentType(DocumentItem.DocumentTypeEnum.GOVERNMENT_ID);
        idDoc.setStatus(DocumentItem.StatusEnum.PENDING);
        docs.add(idDoc);

        DocumentItem payDoc = new DocumentItem();
        payDoc.setDocumentId("DOC-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        payDoc.setDocumentType(DocumentItem.DocumentTypeEnum.PAY_SLIP);
        payDoc.setStatus(DocumentItem.StatusEnum.PENDING);
        docs.add(payDoc);

        doc.setRequiredDocuments(docs);

        // Timeline
        List<StatusHistoryItem> history = new ArrayList<>();
        StatusHistoryItem init = new StatusHistoryItem();
        init.setStatus("SUBMITTED");
        init.setTimestamp(OffsetDateTime.now());
        init.setNote("Financing application submitted through Velora Portal. Under automated underwriter review.");
        history.add(init);
        doc.setStatusHistory(history);

        FinancingApplicationDocument saved = applicationRepository.save(doc);

        FinancingApplicationResponse response = new FinancingApplicationResponse();
        response.setApplicationId(saved.getId());
        response.setReferenceNumber(saved.getReferenceNumber());
        response.setStatus(FinancingApplicationResponse.StatusEnum.SUBMITTED);
        response.setSubmittedAt(saved.getSubmittedAt());
        response.setEstimatedDecisionDate(LocalDate.now().plusDays(2));
        return response;
    }

    public Optional<FinancingApplicationDetail> getFinancingApplication(String applicationId, String applicantEmail) {
        Optional<FinancingApplicationDocument> opt = applicationRepository.findById(applicationId);
        if (opt.isEmpty()) {
            opt = applicationRepository.findByReferenceNumber(applicationId);
        }

        return opt.filter(d -> {
            if (applicantEmail != null && !applicantEmail.isBlank()) {
                return d.getApplicant() != null && applicantEmail.equalsIgnoreCase(d.getApplicant().getEmail());
            }
            return true;
        }).map(d -> {
            FinancingApplicationDetail detail = new FinancingApplicationDetail();
            detail.setApplicationId(d.getId());
            detail.setReferenceNumber(d.getReferenceNumber());
            detail.setStatus(FinancingApplicationDetail.StatusEnum.fromValue(d.getStatus()));
            detail.setSubmittedAt(d.getSubmittedAt());
            detail.setApplicant(d.getApplicant());
            detail.setEmployment(d.getEmployment());
            detail.setVehicleDetails(d.getVehicleDetails());
            detail.setLoanTerms(d.getLoanTerms());
            detail.setRequiredDocuments(d.getRequiredDocuments());
            detail.setStatusHistory(d.getStatusHistory());
            return detail;
        });
    }

    public Optional<DocumentSubmissionResponse> uploadApplicationDocument(String applicationId, DocumentSubmissionRequest request) {
        Optional<FinancingApplicationDocument> opt = applicationRepository.findById(applicationId);
        if (opt.isEmpty()) {
            opt = applicationRepository.findByReferenceNumber(applicationId);
        }

        if (opt.isEmpty()) {
            return Optional.empty();
        }

        FinancingApplicationDocument doc = opt.get();
        String docId = "DOC-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        DocumentItem item = new DocumentItem();
        item.setDocumentId(docId);
        item.setDocumentType(DocumentItem.DocumentTypeEnum.fromValue(request.getDocumentType().getValue()));
        item.setFileName(request.getFileName());
        item.setStatus(DocumentItem.StatusEnum.UPLOADED);
        item.setUploadedAt(OffsetDateTime.now());

        doc.getRequiredDocuments().removeIf(d -> d.getDocumentType().getValue().equals(request.getDocumentType().getValue()));
        doc.getRequiredDocuments().add(item);

        StatusHistoryItem updateNote = new StatusHistoryItem();
        updateNote.setStatus("DOCUMENT_UPLOADED");
        updateNote.setTimestamp(OffsetDateTime.now());
        updateNote.setNote("Uploaded " + request.getDocumentType() + " (" + request.getFileName() + ").");
        doc.getStatusHistory().add(updateNote);

        applicationRepository.save(doc);

        DocumentSubmissionResponse res = new DocumentSubmissionResponse();
        res.setDocumentId(docId);
        res.setDocumentType(request.getDocumentType().getValue());
        res.setFileName(request.getFileName());
        res.setStatus("UPLOADED");
        res.setUploadTimestamp(OffsetDateTime.now());
        return Optional.of(res);
    }
}
