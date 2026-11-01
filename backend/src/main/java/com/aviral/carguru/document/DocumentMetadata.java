package com.aviral.carguru.document;

import com.aviral.carguru.model.ApplicationDocument;
import com.aviral.carguru.model.DocumentItem;

import java.time.OffsetDateTime;

public class DocumentMetadata extends DocumentItem {

    private OffsetDateTime verifiedAt;
    private String notes;

    public DocumentMetadata() {
        super();
    }

    public DocumentMetadata(DocumentItem item) {
        super();
        if (item != null) {
            setDocumentId(item.getDocumentId());
            setDocumentType(item.getDocumentType());
            setFileName(item.getFileName());
            setStatus(item.getStatus());
            setUploadedAt(item.getUploadedAt());
        }
    }

    public DocumentMetadata(ApplicationDocument doc) {
        super();
        if (doc != null) {
            setDocumentId(doc.getDocumentId());
            if (doc.getDocumentType() != null) {
                setDocumentType(DocumentItem.DocumentTypeEnum.fromValue(doc.getDocumentType().getValue()));
            }
            setFileName(doc.getFileName());
            if (doc.getStatus() != null) {
                setStatus(DocumentItem.StatusEnum.fromValue(doc.getStatus().getValue()));
            }
            setUploadedAt(doc.getUploadedAt());
            this.verifiedAt = doc.getVerifiedAt();
            this.notes = doc.getNotes();
        }
    }

    public OffsetDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(OffsetDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public ApplicationDocument toApplicationDocument() {
        ApplicationDocument doc = new ApplicationDocument();
        doc.setDocumentId(getDocumentId());
        if (getDocumentType() != null) {
            doc.setDocumentType(ApplicationDocument.DocumentTypeEnum.fromValue(getDocumentType().getValue()));
        }
        doc.setFileName(getFileName());
        if (getStatus() != null) {
            doc.setStatus(ApplicationDocument.StatusEnum.fromValue(getStatus().getValue()));
        }
        doc.setUploadedAt(getUploadedAt());
        doc.setVerifiedAt(getVerifiedAt());
        doc.setNotes(getNotes());
        return doc;
    }
}

