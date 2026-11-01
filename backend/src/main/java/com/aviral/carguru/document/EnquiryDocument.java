package com.aviral.carguru.document;

import com.aviral.carguru.model.CustomerContact;
import com.aviral.carguru.model.VehicleReference;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "enquiries")
public class EnquiryDocument {

    @Id
    private String id;

    @Indexed(unique = true)
    private String referenceTicket; // VEL-ENQ-XXXX

    private String enquiryType;     // PRICE_QUOTE, FINANCE_ASSISTANCE, TRADE_IN, GENERAL

    @Indexed
    private EnquiryStatus status = EnquiryStatus.NEW;

    private String assignedAdvisor;

    private CustomerContact customer;

    private VehicleReference vehicleReference;

    private String preferredTimeSlot;

    private String postalCode;

    private String message;

    private List<String> resolutionNotes = new ArrayList<>();

    private Instant createdAt;

    private Instant updatedAt;

    public EnquiryDocument() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getReferenceTicket() {
        return referenceTicket;
    }

    public void setReferenceTicket(String referenceTicket) {
        this.referenceTicket = referenceTicket;
    }

    public String getEnquiryType() {
        return enquiryType;
    }

    public void setEnquiryType(String enquiryType) {
        this.enquiryType = enquiryType;
    }

    public EnquiryStatus getStatus() {
        return status;
    }

    public String getStatusValue() {
        return status != null ? status.name() : null;
    }

    public void setStatus(EnquiryStatus status) {
        this.status = status;
    }

    public void setStatus(String status) {
        if (status == null || status.isBlank()) {
            this.status = EnquiryStatus.NEW;
        } else {
            this.status = EnquiryStatus.fromString(status);
        }
    }

    public String getAssignedAdvisor() {
        return assignedAdvisor;
    }

    public void setAssignedAdvisor(String assignedAdvisor) {
        this.assignedAdvisor = assignedAdvisor;
    }

    public CustomerContact getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerContact customer) {
        this.customer = customer;
    }

    public VehicleReference getVehicleReference() {
        return vehicleReference;
    }

    public void setVehicleReference(VehicleReference vehicleReference) {
        this.vehicleReference = vehicleReference;
    }

    public String getPreferredTimeSlot() {
        return preferredTimeSlot;
    }

    public void setPreferredTimeSlot(String preferredTimeSlot) {
        this.preferredTimeSlot = preferredTimeSlot;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(List<String> resolutionNotes) {
        this.resolutionNotes = resolutionNotes != null ? resolutionNotes : new ArrayList<>();
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getCreatedAtAsOffsetDateTime() {
        return createdAt != null ? createdAt.atOffset(ZoneOffset.UTC) : null;
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
