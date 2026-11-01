package com.aviral.carguru.document;

import com.aviral.carguru.model.StatusHistoryItem;

import java.time.OffsetDateTime;

public class StatusAuditLog extends StatusHistoryItem {

    public StatusAuditLog() {
        super();
    }

    public StatusAuditLog(String status, OffsetDateTime timestamp, String authorName, String note) {
        super();
        setStatus(status);
        setTimestamp(timestamp);
        setAuthorName(authorName);
        setNote(note);
    }

    public StatusAuditLog(StatusHistoryItem item) {
        super();
        if (item != null) {
            setStatus(item.getStatus());
            setTimestamp(item.getTimestamp());
            setAuthorName(item.getAuthorName());
            setNote(item.getNote());
        }
    }
}

