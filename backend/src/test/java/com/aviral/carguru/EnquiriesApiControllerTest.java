package com.aviral.carguru;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.aviral.carguru.controller.EnquiriesApiController;
import com.aviral.carguru.model.*;
import com.aviral.carguru.service.EnquiryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EnquiriesApiController.class)
public class EnquiriesApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EnquiryService enquiryService;

    @Test
    void testListEnquiriesEndpoint() throws Exception {
        EnquiriesListResponse response = new EnquiriesListResponse();
        response.setTotalCount(1);
        response.setTotal(1);

        EnquiryDetail detail = new EnquiryDetail();
        detail.setEnquiryId("enq-555");
        detail.setStatus("NEW");
        detail.setEnquiryType("PRICE_QUOTE");
        response.setEnquiries(List.of(detail));

        when(enquiryService.listEnquiries("NEW", "PRICE_QUOTE")).thenReturn(response);

        mockMvc.perform(get("/api/v1/enquiries")
                        .param("status", "NEW")
                        .param("type", "PRICE_QUOTE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCount").value(1))
                .andExpect(jsonPath("$.enquiries[0].enquiryId").value("enq-555"));
    }

    @Test
    void testUpdateEnquiryEndpoint() throws Exception {
        UpdateEnquiryRequest req = new UpdateEnquiryRequest();
        req.setStatus("CONTACTED");
        req.setAssignedAdvisor("Rohan Mehta");
        req.setResolutionNote("Customer contacted.");

        EnquiryDetail detail = new EnquiryDetail();
        detail.setEnquiryId("enq-101");
        detail.setStatus("CONTACTED");
        detail.setAssignedAdvisor("Rohan Mehta");

        when(enquiryService.updateEnquiry(eq("enq-101"), any(UpdateEnquiryRequest.class)))
                .thenReturn(Optional.of(detail));

        mockMvc.perform(patch("/api/v1/enquiries/enq-101")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enquiryId").value("enq-101"))
                .andExpect(jsonPath("$.status").value("CONTACTED"))
                .andExpect(jsonPath("$.assignedAdvisor").value("Rohan Mehta"));
    }

    @Test
    void testListTestDrivesEndpoint() throws Exception {
        TestDriveBookingDetail detail = new TestDriveBookingDetail();
        detail.setBookingId("td-777");
        detail.setConfirmationCode("VEL-DRIVE-7777");
        detail.setStatus(TestDriveBookingDetail.StatusEnum.CONFIRMED);
        detail.setVehicleId("VEL-2026-GT");
        detail.setPreferredDate(LocalDate.now());

        when(enquiryService.listTestDrives()).thenReturn(List.of(detail));

        mockMvc.perform(get("/api/v1/enquiries/test-drive"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].bookingId").value("td-777"))
                .andExpect(jsonPath("$[0].status").value("CONFIRMED"));
    }

    @Test
    void testUpdateTestDriveEndpoint() throws Exception {
        UpdateTestDriveRequest req = new UpdateTestDriveRequest();
        req.setStatus(UpdateTestDriveRequest.StatusEnum.COMPLETED);
        req.setDealershipLocation("Velora Flagship Experience Center - Bangalore");
        req.setNotes("Test drive completed successfully.");

        TestDriveBookingDetail detail = new TestDriveBookingDetail();
        detail.setBookingId("td-888");
        detail.setStatus(TestDriveBookingDetail.StatusEnum.COMPLETED);
        detail.setDealershipLocation("Velora Flagship Experience Center - Bangalore");

        when(enquiryService.updateTestDrive(eq("td-888"), any(UpdateTestDriveRequest.class)))
                .thenReturn(Optional.of(detail));

        mockMvc.perform(patch("/api/v1/enquiries/test-drive/td-888")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bookingId").value("td-888"))
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }
}

