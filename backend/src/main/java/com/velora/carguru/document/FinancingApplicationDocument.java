package com.velora.carguru.document;

import com.velora.carguru.model.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "financing_applications")
public class FinancingApplicationDocument {

    @Id
    private String id;

    @Indexed(unique = true)
    private String referenceNumber;

    @Indexed
    private String status;

    private OffsetDateTime submittedAt;

    private ApplicantPersonalDetails applicant;

    private EmploymentDetails employment;

    private VehicleApplicationDetails vehicleDetails;

    private LoanStructureRequest loanTerms;

    private ApplicationConsents consents;

    private List<DocumentItem> requiredDocuments = new ArrayList<>();

    private List<StatusHistoryItem> statusHistory = new ArrayList<>();

    public FinancingApplicationDocument() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public OffsetDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(OffsetDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public ApplicantPersonalDetails getApplicant() {
        return applicant;
    }

    public void setApplicant(ApplicantPersonalDetails applicant) {
        this.applicant = applicant;
    }

    public EmploymentDetails getEmployment() {
        return employment;
    }

    public void setEmployment(EmploymentDetails employment) {
        this.employment = employment;
    }

    public VehicleApplicationDetails getVehicleDetails() {
        return vehicleDetails;
    }

    public void setVehicleDetails(VehicleApplicationDetails vehicleDetails) {
        this.vehicleDetails = vehicleDetails;
    }

    public LoanStructureRequest getLoanTerms() {
        return loanTerms;
    }

    public void setLoanTerms(LoanStructureRequest loanTerms) {
        this.loanTerms = loanTerms;
    }

    public ApplicationConsents getConsents() {
        return consents;
    }

    public void setConsents(ApplicationConsents consents) {
        this.consents = consents;
    }

    public List<DocumentItem> getRequiredDocuments() {
        return requiredDocuments;
    }

    public void setRequiredDocuments(List<DocumentItem> requiredDocuments) {
        this.requiredDocuments = requiredDocuments;
    }

    public List<StatusHistoryItem> getStatusHistory() {
        return statusHistory;
    }

    public void setStatusHistory(List<StatusHistoryItem> statusHistory) {
        this.statusHistory = statusHistory;
    }
}
