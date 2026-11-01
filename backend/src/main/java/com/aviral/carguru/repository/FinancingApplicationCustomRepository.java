package com.aviral.carguru.repository;

import com.aviral.carguru.document.FinancingApplicationDocument;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FinancingApplicationCustomRepository {

    List<FinancingApplicationDocument> findApplicationsWithDynamicFilter(String status, String employmentType, String search, Pageable pageable);

    default List<FinancingApplicationDocument> findApplicationsWithDynamicFilter(String status, String employmentType, String search) {
        return findApplicationsWithDynamicFilter(status, employmentType, search, Pageable.unpaged());
    }

    long countApplicationsWithDynamicFilter(String status, String employmentType, String search);
}
