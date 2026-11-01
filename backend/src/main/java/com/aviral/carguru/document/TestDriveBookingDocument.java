package com.aviral.carguru.document;

import com.aviral.carguru.model.CustomerContact;
import com.aviral.carguru.model.TestDriveBookingDetail;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Document(collection = "test_drive_bookings")
public class TestDriveBookingDocument {

    @Id
    private String id;

    @Indexed(unique = true)
    private String confirmationCode; // VEL-DRIVE-XXXX

    private String vehicleId;

    @Indexed
    private String status = "CONFIRMED"; // CONFIRMED, COMPLETED, RESCHEDULED, CANCELLED

    private LocalDate preferredDate;

    private CustomerContact customer;

    private String dealershipLocation;

    private String preferredTimeSlot;

    private Boolean driverLicenseValid;

    private String notes;

    private OffsetDateTime scheduledDateTime;

    private Instant createdAt;

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

    public String getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(String vehicleId) {
        this.vehicleId = vehicleId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getPreferredDate() {
        return preferredDate;
    }

    public void setPreferredDate(LocalDate preferredDate) {
        this.preferredDate = preferredDate;
    }

    public CustomerContact getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerContact customer) {
        this.customer = customer;
    }

    public String getDealershipLocation() {
        return dealershipLocation;
    }

    public void setDealershipLocation(String dealershipLocation) {
        this.dealershipLocation = dealershipLocation;
    }

    public String getPreferredTimeSlot() {
        return preferredTimeSlot;
    }

    public void setPreferredTimeSlot(String preferredTimeSlot) {
        this.preferredTimeSlot = preferredTimeSlot;
    }

    public Boolean getDriverLicenseValid() {
        return driverLicenseValid;
    }

    public void setDriverLicenseValid(Boolean driverLicenseValid) {
        this.driverLicenseValid = driverLicenseValid;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public OffsetDateTime getScheduledDateTime() {
        return scheduledDateTime;
    }

    public void setScheduledDateTime(OffsetDateTime scheduledDateTime) {
        this.scheduledDateTime = scheduledDateTime;
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

    public TestDriveBookingDetail toDetail() {
        TestDriveBookingDetail detail = new TestDriveBookingDetail();
        detail.setBookingId(id);
        detail.setConfirmationCode(confirmationCode);
        if (status != null) {
            try {
                detail.setStatus(TestDriveBookingDetail.StatusEnum.fromValue(status.toUpperCase()));
            } catch (IllegalArgumentException e) {
                detail.setStatus(TestDriveBookingDetail.StatusEnum.CONFIRMED);
            }
        }
        detail.setCustomer(customer);
        detail.setVehicleId(vehicleId);
        detail.setDealershipLocation(dealershipLocation);
        detail.setPreferredDate(preferredDate);
        detail.setPreferredTimeSlot(preferredTimeSlot);
        detail.setDriverLicenseValid(driverLicenseValid);
        detail.setNotes(notes);
        detail.setScheduledDateTime(scheduledDateTime);
        detail.setCreatedAt(getCreatedAtAsOffsetDateTime());
        return detail;
    }
}
