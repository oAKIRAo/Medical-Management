package ma.medecins_service.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;
@Entity
@Data
public class Medecin {
    @Id
    @GeneratedValue
    private Long id;
    @Column(unique=true)
    private String matricule;
    private String firstname;
    private String lastname;
    private String specialty;
}
