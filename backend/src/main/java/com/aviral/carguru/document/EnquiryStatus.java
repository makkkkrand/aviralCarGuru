package com.aviral.carguru.document;

public enum EnquiryStatus {
    NEW,
    IN_PROGRESS,
    CONTACTED,
    CONVERTED,
    CANCELLED;

    public static EnquiryStatus fromString(String val) {
        if (val == null || val.isBlank()) {
            return NEW;
        }
        try {
            return EnquiryStatus.valueOf(val.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return NEW;
        }
    }
}

