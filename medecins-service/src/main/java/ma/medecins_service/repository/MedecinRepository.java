package ma.medecins_service.repository;

import ma.medecins_service.Model.Medecin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedecinRepository extends JpaRepository<Medecin, Long> {
}
