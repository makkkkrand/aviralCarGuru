package com.aviral.carguru;

import com.aviral.carguru.document.EnquiryDocument;
import com.aviral.carguru.document.EnquiryStatus;
import com.aviral.carguru.document.TestDriveBookingDocument;
import com.aviral.carguru.model.*;
import com.aviral.carguru.repository.EnquiryRepository;
import com.aviral.carguru.repository.TestDriveBookingRepository;
import com.aviral.carguru.service.EnquiryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class EnquiryServiceTest {

    private EnquiryService enquiryService;
    private EnquiryRepository enquiryRepository;
    private TestDriveBookingRepository testDriveBookingRepository;

    @BeforeEach
    void setUp() {
        enquiryRepository = Mockito.mock(EnquiryRepository.class);
        testDriveBookingRepository = Mockito.mock(TestDriveBookingRepository.class);
        enquiryService = new EnquiryService(enquiryRepository, testDriveBookingRepository);
    }

    @Test
    void testCreateEnquiry() {
        CreateEnquiryRequest request = new CreateEnquiryRequest();
        request.setEnquiryType(CreateEnquiryRequest.EnquiryTypeEnum.PRICE_QUOTE);
        CustomerContact customer = new CustomerContact();
        customer.setFirstName("Rahul");
        customer.setLastName("Verma");
        customer.setEmail("rahul.verma@example.com");
        customer.setPhone("+919876543210");
        request.setCustomer(customer);
        request.setMessage("Looking for on-road pricing and corporate discounts.");

        when(enquiryRepository.save(any(EnquiryDocument.class))).thenAnswer(inv -> {
            EnquiryDocument doc = inv.getArgument(0);
            doc.setId("enq-123");
            return doc;
        });

        EnquiryResponse response = enquiryService.createEnquiry(request);

        assertNotNull(response);
        assertEquals("enq-123", response.getEnquiryId());
        assertTrue(response.getReferenceTicket().startsWith("VEL-ENQ-"));
        assertEquals(EnquiryResponse.StatusEnum.NEW, response.getStatus());
    }

    @Test
    void testListEnquiriesFiltersByStatusAndType() {
        EnquiryDocument doc1 = new EnquiryDocument();
        doc1.setId("enq-1");
        doc1.setReferenceTicket("VEL-ENQ-1001");
        doc1.setStatus(EnquiryStatus.NEW);
        doc1.setEnquiryType("PRICE_QUOTE");

        when(enquiryRepository.findByStatusAndEnquiryType("NEW", "PRICE_QUOTE")).thenReturn(List.of(doc1));

        EnquiriesListResponse response = enquiryService.listEnquiries("NEW", "PRICE_QUOTE");

        assertNotNull(response);
        assertEquals(1, response.getTotalCount());
        assertEquals(1, response.getEnquiries().size());
        assertEquals("enq-1", response.getEnquiries().get(0).getEnquiryId());
    }

    @Test
    void testUpdateEnquiryUpdatesStatusAdvisorAndResolutionNotes() {
        String enqId = "enq-101";
        EnquiryDocument existing = new EnquiryDocument();
        existing.setId(enqId);
        existing.setReferenceTicket("VEL-ENQ-9901");
        existing.setStatus(EnquiryStatus.NEW);
        existing.setResolutionNotes(new ArrayList<>(List.of("Lead generated")));

        when(enquiryRepository.findById(enqId)).thenReturn(Optional.of(existing));
        when(enquiryRepository.save(any(EnquiryDocument.class))).thenAnswer(inv -> inv.getArgument(0));

        UpdateEnquiryRequest updateReq = new UpdateEnquiryRequest();
        updateReq.setStatus("CONTACTED");
        updateReq.setAssignedAdvisor("Rohan Mehta");
        updateReq.setResolutionNote("Customer called regarding luxury sedan discount; test drive scheduled.");

        Optional<EnquiryDetail> resOpt = enquiryService.updateEnquiry(enqId, updateReq);

        assertTrue(resOpt.isPresent());
        EnquiryDetail res = resOpt.get();
        assertEquals("CONTACTED", res.getStatus());
        assertEquals("Rohan Mehta", res.getAssignedAdvisor());
        assertEquals(2, res.getResolutionNotes().size());

        ArgumentCaptor<EnquiryDocument> captor = ArgumentCaptor.forClass(EnquiryDocument.class);
        verify(enquiryRepository).save(captor.capture());
        EnquiryDocument saved = captor.getValue();
        assertEquals(EnquiryStatus.CONTACTED, saved.getStatus());
        assertEquals("Rohan Mehta", saved.getAssignedAdvisor());
        assertTrue(saved.getResolutionNotes().contains("Customer called regarding luxury sedan discount; test drive scheduled."));
    }

    @Test
    void testListTestDrives() {
        TestDriveBookingDocument doc = new TestDriveBookingDocument();
        doc.setId("td-100");
        doc.setConfirmationCode("VEL-DRIVE-1001");
        doc.setStatus("CONFIRMED");
        doc.setVehicleId("VEL-2026-GT");
        doc.setPreferredDate(LocalDate.now().plusDays(2));

        when(testDriveBookingRepository.findAll(any(Sort.class))).thenReturn(List.of(doc));

        List<TestDriveBookingDetail> list = enquiryService.listTestDrives();

        assertNotNull(list);
        assertEquals(1, list.size());
        assertEquals("td-100", list.get(0).getBookingId());
        assertEquals(TestDriveBookingDetail.StatusEnum.CONFIRMED, list.get(0).getStatus());
    }

    @Test
    void testBookTestDrive() {
        TestDriveBookingRequest req = new TestDriveBookingRequest();
        CustomerContact contact = new CustomerContact();
        contact.setFirstName("Pooja");
        contact.setLastName("Hegde");
        contact.setEmail("pooja@example.com");
        contact.setPhone("+919988776655");
        req.setCustomer(contact);
        req.setVehicleId("VEL-2026-SUV");
        req.setDealershipLocation("Velora Flagship Experience Center - Mumbai BKC");
        req.setPreferredDate(LocalDate.now().plusDays(3));
        req.setPreferredTimeSlot(TestDriveBookingRequest.PreferredTimeSlotEnum.AFTERNOON);
        req.setDriverLicenseValid(true);
        req.setNotes("Interested in off-road mode demo.");

        when(testDriveBookingRepository.save(any(TestDriveBookingDocument.class))).thenAnswer(inv -> {
            TestDriveBookingDocument d = inv.getArgument(0);
            d.setId("td-200");
            return d;
        });

        TestDriveBookingResponse res = enquiryService.bookTestDrive(req);

        assertNotNull(res);
        assertEquals("td-200", res.getBookingId());
        assertEquals(TestDriveBookingResponse.StatusEnum.CONFIRMED, res.getStatus());
    }

    @Test
    void testUpdateTestDriveStatusToConfirmedCompletedOrRescheduled() {
        String bookingId = "td-501";
        TestDriveBookingDocument existing = new TestDriveBookingDocument();
        existing.setId(bookingId);
        existing.setConfirmationCode("VEL-DRIVE-8822");
        existing.setStatus("CONFIRMED");

        when(testDriveBookingRepository.findById(bookingId)).thenReturn(Optional.of(existing));
        when(testDriveBookingRepository.save(any(TestDriveBookingDocument.class))).thenAnswer(inv -> inv.getArgument(0));

        UpdateTestDriveRequest updateReq = new UpdateTestDriveRequest();
        updateReq.setStatus(UpdateTestDriveRequest.StatusEnum.COMPLETED);
        updateReq.setNotes("Customer tested highway acceleration and braking.");

        Optional<TestDriveBookingDetail> resOpt = enquiryService.updateTestDrive(bookingId, updateReq);

        assertTrue(resOpt.isPresent());
        TestDriveBookingDetail res = resOpt.get();
        assertEquals(TestDriveBookingDetail.StatusEnum.COMPLETED, res.getStatus());

        ArgumentCaptor<TestDriveBookingDocument> captor = ArgumentCaptor.forClass(TestDriveBookingDocument.class);
        verify(testDriveBookingRepository).save(captor.capture());
        TestDriveBookingDocument saved = captor.getValue();
        assertEquals("COMPLETED", saved.getStatus());
        assertTrue(saved.getNotes().contains("Customer tested highway acceleration and braking."));
    }
}
