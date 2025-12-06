package ma.patient_service.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Patient {
    @Id
    @GeneratedValue
    private Long id;
    private String firstName;
    private String lastName;
    private String CIN;
    private String phoneNumber;
}
