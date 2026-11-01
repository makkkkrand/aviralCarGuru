package com.aviral.carguru.document;

import com.aviral.carguru.model.LoanStructureRequest;

public class LoanTerms extends LoanStructureRequest {

    public LoanTerms() {
        super();
    }

    public LoanTerms(LoanStructureRequest request) {
        super();
        if (request != null) {
            setDownPayment(request.getDownPayment());
            setTradeInValue(request.getTradeInValue());
            setTenureMonths(request.getTenureMonths());
            setRequestedLoanAmount(request.getRequestedLoanAmount());
            setApprovedAmount(request.getApprovedAmount());
            setOfferedApr(request.getOfferedApr());
        }
    }
}
