package ma.patient_service.exception;

public class DossierMedicalNotFoundException extends RuntimeException {
    public DossierMedicalNotFoundException(Long id) {
        super("Dossier Medical Not Found: " + id);
    }
}
