package ma.medecins_service.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AppointmentDTO {

    private Long id;
    private LocalDate date;
    private String heure;

    // Références
    private Long patientId;
    private Long medecinId;

    // informations sur le patient
    private String patientFirstName;
    private String patientLastName;
    private String patientCin;
    private String patientPhone;

    // info sur le medecin
    private String medecinNom;
}
