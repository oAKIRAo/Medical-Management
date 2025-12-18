package ma.api_gateway.dto;

import lombok.Data;

@Data
public class DossierMedicalDTO {
    private Long id;
    private String logs;
    private String allergies;
    PatientDTO patient;
}