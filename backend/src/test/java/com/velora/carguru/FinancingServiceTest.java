package com.velora.carguru;

import com.velora.carguru.model.LoanCalculationRequest;
import com.velora.carguru.model.LoanCalculationResponse;
import com.velora.carguru.repository.FinancingApplicationRepository;
import com.velora.carguru.service.FinancingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.*;

public class FinancingServiceTest {

    private FinancingService financingService;
    private FinancingApplicationRepository repository;

    @BeforeEach
    void setUp() {
        repository = Mockito.mock(FinancingApplicationRepository.class);
        financingService = new FinancingService(repository);
    }

    @Test
    void testCalculateLoan() {
        LoanCalculationRequest request = new LoanCalculationRequest();
        request.setVehiclePrice(100000.0);
        request.setDownPayment(20000.0);
        request.setTradeInValue(0.0);
        request.setSalesTaxRate(7.0);
        request.setInterestRateAnnual(4.0);
        request.setTenureMonths(60);

        LoanCalculationResponse response = financingService.calculateLoan(request);

        assertNotNull(response);
        assertEquals(100000.0, response.getVehiclePrice());
        assertEquals(7000.0, response.getTotalSalesTax());
        assertEquals(87000.0, response.getNetCapitalizedCost());
        assertTrue(response.getMonthlyPayment() > 0);
        assertEquals(5, response.getAmortizationSchedule().size());
    }
}
