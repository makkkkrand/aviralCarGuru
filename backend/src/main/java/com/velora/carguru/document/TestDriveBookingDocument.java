package com.velora.carguru.document;

import com.velora.carguru.model.CustomerContact;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Document(collection = "test_drive_bookings")
public class TestDriveBookingDocument {

    @Id
    private String id;

    @Indexed(unique = true)
    private String confirmationCode;

    private CustomerContact customer;

    private String vehicleId;

    private String dealershipLocation;

    private LocalDate preferredDate;

    private String preferredTimeSlot;

    private boolean driverLicenseValid;

    private String notes;

    @Indexed
    private String status;

    private OffsetDateTime scheduledDateTime;

    private OffsetDateTime createdAt;

    public TestDriveBookingDocument() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getConfirmationCode() {
        return confirmationCode;
    }

    public void setConfirmationCode(String confirmationCode) {
        this.confirmationCode = confirmationCode;
    }

    public CustomerContact getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerContact customer) {
        this.customer = customer;
    }

    public String getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(String vehicleId) {
        this.vehicleId = vehicleId;
    }

    public String getDealershipLocation() {
        return dealershipLocation;
    }

    public void setDealershipLocation(String dealershipLocation) {
        this.dealershipLocation = dealershipLocation;
    }

    public LocalDate getPreferredDate() {
        return preferredDate;
    }

    public void setPreferredDate(LocalDate preferredDate) {
        this.preferredDate = preferredDate;
    }

    public String getPreferredTimeSlot() {
        return preferredTimeSlot;
    }

    public void setPreferredTimeSlot(String preferredTimeSlot) {
        this.preferredTimeSlot = preferredTimeSlot;
    }

    public boolean isDriverLicenseValid() {
        return driverLicenseValid;
    }

    public void setDriverLicenseValid(boolean driverLicenseValid) {
        this.driverLicenseValid = driverLicenseValid;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public OffsetDateTime getScheduledDateTime() {
        return scheduledDateTime;
    }

    public void setScheduledDateTime(OffsetDateTime scheduledDateTime) {
        this.scheduledDateTime = scheduledDateTime;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
