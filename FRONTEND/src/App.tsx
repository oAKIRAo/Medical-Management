import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Appointments from "./pages/Appointments";
import Tables from "./pages/tables";
import PatientDetails from "./pages/PatientsDetails";
import Analytics from "./pages/Analytics";
function App() {
  const isLoggedIn = !!sessionStorage.getItem("username");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/appointments"
          element={isLoggedIn ? <Appointments /> : <Navigate to="/login" />}
        />
        <Route
          path="/tables"
          element={isLoggedIn ? <Tables /> : <Navigate to="/login" />}
        />
        <Route
          path="/tables/details/:id"
          element={isLoggedIn ? <PatientDetails /> : <Navigate to="/login" />}
         />
        <Route
          path="/analytics"
          element={isLoggedIn ? <Analytics /> : <Navigate to="/login" />}
         />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
