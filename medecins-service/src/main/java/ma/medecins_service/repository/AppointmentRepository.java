package ma.medecins_service.repository;

import jakarta.transaction.Transactional;
import ma.medecins_service.Model.Appointment;
import ma.medecins_service.Model.Medecin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Query("""
        SELECT a.medecin.lastname, COUNT(a)
        FROM Appointment a
        GROUP BY a.medecin.lastname
    """)
    List<Object[]> countAppointmentsPerDoctor();

    @Modifying
    @Transactional
    @Query("DELETE FROM Appointment a WHERE a.patientId = :patientId")
    void deleteByPatientId(@Param("patientId") Long patientId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Appointment a WHERE a.medecin.id = :medecinId")
    void deleteByMedecinId(@Param("medecinId") Long medecinId);

    boolean existsByMedecinId(Long medecinId);

}
