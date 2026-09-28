package com.velora.carguru;

import com.velora.carguru.model.LoanCalculationRequest;
import com.velora.carguru.model.LoanCalculationResponse;
import com.velora.carguru.repository.FinancingApplicationRepository;
import com.velora.carguru.service.FinancingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.*;

class FinancingServiceTest {

    private FinancingService financingService;
    private FinancingApplicationRepository repository;

    @BeforeEach
    void setUp() {
        repository = Mockito.mock(FinancingApplicationRepository.class);
        financingService = new FinancingService(repository);
    }

    @Test
    void testCalculateLoan_StandardLuxuryCar() {
        LoanCalculationRequest request = new LoanCalculationRequest();
        request.setVehiclePrice(65000.0);
        request.setDownPayment(10000.0);
        request.setTradeInValue(5000.0);
        request.setInterestRateAnnual(4.99);
        request.setTenureMonths(60);
        request.setSalesTaxRate(7.0);

        LoanCalculationResponse response = financingService.calculateLoan(request);

        assertNotNull(response);
        assertEquals(65000.0, response.getVehiclePrice());
        assertEquals(10000.0, response.getDownPayment());
        assertEquals(4550.0, response.getTotalSalesTax()); // 65000 * 0.07 = 4550
        assertEquals(54550.0, response.getNetCapitalizedCost()); // 65000 + 4550 - 10000 - 5000 = 54550
        assertTrue(response.getMonthlyPayment() > 900.0 && response.getMonthlyPayment() < 1200.0);
        assertTrue(response.getTotalInterest() > 0);
        assertNotNull(response.getAmortizationSchedule());
        assertEquals(5, response.getAmortizationSchedule().size()); // 60 months = 5 years
    }
}
