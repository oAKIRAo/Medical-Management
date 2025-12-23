package ma.medecins_service.Service;

import ma.medecins_service.repository.AppointmentRepository;
import ma.medecins_service.repository.MedecinRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service
public class AnalyticsService {
    private final AppointmentRepository appointmentRepository;
    private final MedecinRepository medecinRepository;

    public AnalyticsService(AppointmentRepository appointmentRepository, MedecinRepository medecinRepository) {
        this.appointmentRepository = appointmentRepository;
        this.medecinRepository = medecinRepository;
    }

    public Map<String, Long> getAppointmentsPerDoctor() {
        List<Object[]> results = appointmentRepository.countAppointmentsPerDoctor();

        Map<String, Long> map = new HashMap<>();
        for (Object[] row : results) {
            String medecinNom = (String) row[0];
            Long count = (Long) row[1];
            map.put(medecinNom, count);
        }
        return map;
    }
    //total des medecins
    public long getMedecinCount() {
        return medecinRepository.count();
    }
    //total des rendez-vous
    public long getTotalAppointments() {
        return appointmentRepository.count();
    }
}
