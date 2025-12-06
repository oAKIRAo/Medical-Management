package ma.medecins_service.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Appointment {
    @Id
    @GeneratedValue
    private int id;
    private LocalDate date;
    private String heure;
    @ManyToOne
    Medecin medecin;
    private Long patientId;
}
