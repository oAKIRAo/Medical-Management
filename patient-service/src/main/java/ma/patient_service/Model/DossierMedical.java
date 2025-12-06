package ma.patient_service.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;
@Entity
@Data
public class DossierMedical {
    @Id
    @GeneratedValue
    private Long id;
    private String Logs;
    private String allergies;
    @ManyToOne
    Patient patient;
}
