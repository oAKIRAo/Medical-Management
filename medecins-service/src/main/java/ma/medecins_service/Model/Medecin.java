package ma.medecins_service.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;
@Entity
@Data
public class Medecin {
    @Id
    @GeneratedValue
    private int id;
    private String name;
    private String specialty;
}
