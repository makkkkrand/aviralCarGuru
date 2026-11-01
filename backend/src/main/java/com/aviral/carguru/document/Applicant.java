package com.aviral.carguru.document;

import com.aviral.carguru.model.ApplicantPersonalDetails;

public class Applicant extends ApplicantPersonalDetails {

    public Applicant() {
        super();
    }

    public Applicant(ApplicantPersonalDetails details) {
        super();
        if (details != null) {
            setFirstName(details.getFirstName());
            setLastName(details.getLastName());
            setEmail(details.getEmail());
            setPhone(details.getPhone());
            setDateOfBirth(details.getDateOfBirth());
            setAddressLine1(details.getAddressLine1());
            setAddressLine2(details.getAddressLine2());
            setCity(details.getCity());
            setState(details.getState());
            setPostalCode(details.getPostalCode());
            setHousingStatus(details.getHousingStatus());
            setMonthlyHousingPayment(details.getMonthlyHousingPayment());
        }
    }
}
