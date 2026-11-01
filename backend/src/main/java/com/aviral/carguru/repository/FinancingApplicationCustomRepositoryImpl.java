package com.aviral.carguru.repository;

import com.aviral.carguru.document.FinancingApplicationDocument;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Repository
public class FinancingApplicationCustomRepositoryImpl implements FinancingApplicationCustomRepository {

    private final MongoTemplate mongoTemplate;

    public FinancingApplicationCustomRepositoryImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    private Query buildDynamicQuery(String status, String employmentType, String search) {
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
            criteriaList.add(Criteria.where("status").is(status.toUpperCase()));
        }

        if (employmentType != null && !employmentType.isBlank() && !"ALL".equalsIgnoreCase(employmentType)) {
            criteriaList.add(Criteria.where("employment.employmentType").is(employmentType.toUpperCase()));
        }

        if (search != null && !search.trim().isEmpty()) {
            String regex = Pattern.quote(search.trim());
            Criteria searchCriteria = new Criteria().orOperator(
                    Criteria.where("referenceNumber").regex(regex, "i"),
                    Criteria.where("applicant.firstName").regex(regex, "i"),
                    Criteria.where("applicant.lastName").regex(regex, "i"),
                    Criteria.where("applicant.email").regex(regex, "i"),
                    Criteria.where("vehicleDetails.make").regex(regex, "i"),
                    Criteria.where("vehicleDetails.model").regex(regex, "i")
            );
            criteriaList.add(searchCriteria);
        }

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        return query;
    }

    @Override
    public List<FinancingApplicationDocument> findApplicationsWithDynamicFilter(String status, String employmentType, String search, Pageable pageable) {
        Query query = buildDynamicQuery(status, employmentType, search);

        if (pageable != null && pageable.isPaged()) {
            query.with(pageable);
        } else {
            query.with(Sort.by(Sort.Direction.DESC, "submittedAt"));
        }

        return mongoTemplate.find(query, FinancingApplicationDocument.class);
    }

    @Override
    public long countApplicationsWithDynamicFilter(String status, String employmentType, String search) {
        Query query = buildDynamicQuery(status, employmentType, search);
        return mongoTemplate.count(query, FinancingApplicationDocument.class);
    }
}
