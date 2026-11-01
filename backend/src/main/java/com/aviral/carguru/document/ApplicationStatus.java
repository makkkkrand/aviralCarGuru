package com.aviral.carguru.document;

public enum ApplicationStatus {
    SUBMITTED,
    UNDER_REVIEW,
    APPROVED,
    DOCS_REQUIRED,
    REJECTED,
    CONDITIONAL_APPROVAL,
    NEEDS_DOCUMENTS;

    public static ApplicationStatus fromString(String val) {
        if (val == null || val.isBlank()) {
            return SUBMITTED;
        }
        try {
            return ApplicationStatus.valueOf(val.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return SUBMITTED;
        }
    }
}

