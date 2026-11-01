package com.aviral.carguru.document;

import com.aviral.carguru.model.EmploymentDetails;

public class Employment extends EmploymentDetails {

    public Employment() {
        super();
    }

    public Employment(EmploymentDetails details) {
        super();
        if (details != null) {
            setEmployerName(details.getEmployerName());
            setJobTitle(details.getJobTitle());
            setEmploymentType(details.getEmploymentType());
            setMonthlyGrossIncome(details.getMonthlyGrossIncome());
            setMonthsAtCurrentEmployer(details.getMonthsAtCurrentEmployer());
        }
    }
}
