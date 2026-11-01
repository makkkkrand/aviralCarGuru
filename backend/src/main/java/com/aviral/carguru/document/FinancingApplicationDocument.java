package com.aviral.carguru.document;

import com.aviral.carguru.model.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "financing_applications")
public class FinancingApplicationDocument {

    @Id
    private String id;

    @Indexed(unique = true)
    private String referenceNumber; // VEL-APP-YYYY-HEX

    @Indexed
    private ApplicationStatus status = ApplicationStatus.SUBMITTED;

    private Applicant applicant;

    private Employment employment;

    private VehicleDetails vehicleDetails;

    private LoanTerms loanTerms; // requestedLoanAmount, approvedAmount, offeredApr, tenureMonths, downPayment

    private Integer cibilScore = 750;

    private ApplicationConsents consents;

    private List<DocumentMetadata> requiredDocuments = new ArrayList<>();

    private List<StatusAuditLog> statusHistory = new ArrayList<>();

    private Instant submittedAt;

    private Instant updatedAt;

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

    public ApplicationStatus getStatus() {
        return status;
    }

    public String getStatusValue() {
        return status != null ? status.name() : null;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public void setStatus(String status) {
        if (status == null || status.isBlank()) {
            this.status = ApplicationStatus.SUBMITTED;
        } else {
            this.status = ApplicationStatus.fromString(status);
        }
    }

    public Integer getCibilScore() {
        return cibilScore;
    }

    public void setCibilScore(Integer cibilScore) {
        this.cibilScore = cibilScore;
    }

    public Applicant getApplicant() {
        return applicant;
    }

    public void setApplicant(Applicant applicant) {
        this.applicant = applicant;
    }

    public void setApplicant(ApplicantPersonalDetails details) {
        if (details == null) {
            this.applicant = null;
        } else if (details instanceof Applicant a) {
            this.applicant = a;
        } else {
            this.applicant = new Applicant(details);
        }
    }

    public Employment getEmployment() {
        return employment;
    }

    public void setEmployment(Employment employment) {
        this.employment = employment;
    }

    public void setEmployment(EmploymentDetails details) {
        if (details == null) {
            this.employment = null;
        } else if (details instanceof Employment e) {
            this.employment = e;
        } else {
            this.employment = new Employment(details);
        }
    }

    public VehicleDetails getVehicleDetails() {
        return vehicleDetails;
    }

    public void setVehicleDetails(VehicleDetails vehicleDetails) {
        this.vehicleDetails = vehicleDetails;
    }

    public void setVehicleDetails(VehicleApplicationDetails details) {
        if (details == null) {
            this.vehicleDetails = null;
        } else if (details instanceof VehicleDetails v) {
            this.vehicleDetails = v;
        } else {
            this.vehicleDetails = new VehicleDetails(details);
        }
    }

    public LoanTerms getLoanTerms() {
        return loanTerms;
    }

    public void setLoanTerms(LoanTerms loanTerms) {
        this.loanTerms = loanTerms;
    }

    public void setLoanTerms(LoanStructureRequest terms) {
        if (terms == null) {
            this.loanTerms = null;
        } else if (terms instanceof LoanTerms lt) {
            this.loanTerms = lt;
        } else {
            this.loanTerms = new LoanTerms(terms);
        }
    }

    public ApplicationConsents getConsents() {
        return consents;
    }

    public void setConsents(ApplicationConsents consents) {
        this.consents = consents;
    }

    public List<DocumentMetadata> getRequiredDocuments() {
        return requiredDocuments;
    }

    public void setRequiredDocuments(List<DocumentMetadata> requiredDocuments) {
        this.requiredDocuments = requiredDocuments != null ? requiredDocuments : new ArrayList<>();
    }

    public void setRequiredDocumentItems(List<DocumentItem> items) {
        if (items == null) {
            this.requiredDocuments = new ArrayList<>();
            return;
        }
        this.requiredDocuments = new ArrayList<>(items.stream()
                .map(i -> i instanceof DocumentMetadata dm ? dm : new DocumentMetadata(i))
                .toList());
    }

    public List<StatusAuditLog> getStatusHistory() {
        return statusHistory;
    }

    public void setStatusHistory(List<StatusAuditLog> statusHistory) {
        this.statusHistory = statusHistory != null ? statusHistory : new ArrayList<>();
    }

    public void setStatusHistoryItems(List<StatusHistoryItem> items) {
        if (items == null) {
            this.statusHistory = new ArrayList<>();
            return;
        }
        this.statusHistory = new ArrayList<>(items.stream()
                .map(h -> h instanceof StatusAuditLog sal ? sal : new StatusAuditLog(h))
                .toList());
    }

    public Instant getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(Instant submittedAt) {
        this.submittedAt = submittedAt;
    }

    public OffsetDateTime getSubmittedAtAsOffsetDateTime() {
        return submittedAt != null ? submittedAt.atOffset(ZoneOffset.UTC) : null;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public OffsetDateTime getUpdatedAtAsOffsetDateTime() {
        return updatedAt != null ? updatedAt.atOffset(ZoneOffset.UTC) : null;
    }
}
