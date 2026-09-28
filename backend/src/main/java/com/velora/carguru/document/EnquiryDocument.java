package com.velora.carguru.document;

import com.velora.carguru.model.CustomerContact;
import com.velora.carguru.model.VehicleReference;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "customer_enquiries")
public class EnquiryDocument {

    @Id
    private String id;

    @Indexed(unique = true)
    private String referenceTicket;

    private String enquiryType;

    @Indexed
    private String status;

    private CustomerContact customer;

    private VehicleReference vehicleReference;

    private String preferredTimeSlot;

    private String postalCode;

    private String message;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

    private List<String> resolutionNotes = new ArrayList<>();

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<String> getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(List<String> resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }
}
