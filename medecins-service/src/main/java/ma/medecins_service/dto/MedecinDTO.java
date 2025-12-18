package ma.medecins_service.dto;

import lombok.Data;

@Data
public class MedecinDTO {
    private Long id;
    private String matricule;
    private String firstname;
    private String lastname;
    private String specialty;
}
