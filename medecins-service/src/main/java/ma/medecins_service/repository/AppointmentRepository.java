package ma.medecins_service.repository;

import ma.medecins_service.Model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    @Query("""
        SELECT a.medecin.lastname, COUNT(a)
        FROM Appointment a
        GROUP BY a.medecin.lastname
    """)
    List<Object[]> countAppointmentsPerDoctor();
}
