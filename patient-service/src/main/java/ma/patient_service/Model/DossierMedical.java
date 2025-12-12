    package ma.patient_service.Model;

    import jakarta.persistence.*;
    import lombok.Data;

    import java.util.Optional;

    @Entity
    @Data
    public class DossierMedical {
        @Id
        @GeneratedValue
        private Long id;
        private String logs;
        private String allergies;
        @ManyToOne
        Patient patient;

    }
