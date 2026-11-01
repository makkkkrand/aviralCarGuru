package com.aviral.carguru.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.data.convert.WritingConverter;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Configuration
public class MongoConfig {

    @Bean
    public MongoCustomConversions mongoCustomConversions() {
        List<Converter<?, ?>> converters = new ArrayList<>();
        converters.add(new OffsetDateTimeToDateConverter());
        converters.add(new DateToOffsetDateTimeConverter());
        converters.add(new StringToOffsetDateTimeConverter());
        return new MongoCustomConversions(converters);
    }

    @WritingConverter
    public static class OffsetDateTimeToDateConverter implements Converter<OffsetDateTime, Date> {
        @Override
        public Date convert(OffsetDateTime source) {
            return source == null ? null : Date.from(source.toInstant());
        }
    }

    @ReadingConverter
    public static class DateToOffsetDateTimeConverter implements Converter<Date, OffsetDateTime> {
        @Override
        public OffsetDateTime convert(Date source) {
            return source == null ? null : source.toInstant().atOffset(ZoneOffset.UTC);
        }
    }

    @ReadingConverter
    public static class StringToOffsetDateTimeConverter implements Converter<String, OffsetDateTime> {
        @Override
        public OffsetDateTime convert(String source) {
            return (source == null || source.isBlank()) ? null : OffsetDateTime.parse(source);
        }
    }
}

