import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 

interface AppointmentDTO {
  id: number;
  date: string;
  heure: string;
  patientId: number;
  medecinNom?: string;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const navigate = useNavigate(); 
  useEffect(() => {
    const fetchAppointments = async () => {
      const username = sessionStorage.getItem("username");
      const password = sessionStorage.getItem("password");

      if (!username || !password) {
        navigate("/login"); 
        return;
      }

      const res = await fetch("http://localhost:8888/appointments/", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa(`${username}:${password}`)}`,
        },
      });

      if (res.status === 401) {
        navigate("/login");
      }

      const data = await res.json();
      setAppointments(data);
    };

    fetchAppointments();
  }, [navigate]); 

  return (
    <div>
      <h2>Rendez-vous</h2>
      <ul>
        {appointments.map(a => (
          <li key={a.id}>
            {a.date} - {a.heure} - Patient ID: {a.patientId} - Medecin: {a.medecinNom}
          </li>
        ))}
      </ul>
    </div>
  );
}
