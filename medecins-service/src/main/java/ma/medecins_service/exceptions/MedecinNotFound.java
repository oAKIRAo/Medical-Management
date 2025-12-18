package ma.medecins_service.exceptions;

public class MedecinNotFound extends RuntimeException {
    public MedecinNotFound(Long id) {
        super("Medecin with id " + id + " not found");
    }
}
