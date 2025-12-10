package ma.patient_service.exception;

public class DuplicateCinException extends RuntimeException {
    public DuplicateCinException(String cin) {
        super("Patient with CIN " + cin + " already exists");
    }
}
