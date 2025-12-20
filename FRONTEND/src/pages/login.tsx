import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Test avec fetch pour Basic Auth
      const response = await fetch("http://localhost:8888/appointments/", {
         method: "GET",
         credentials: "include",
         headers: {
             "Authorization": `Basic ${btoa(`${username}:${password}`)}`,
         },
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      sessionStorage.setItem("username", username);
      sessionStorage.setItem("password", password);

      navigate("/appointments");
    } catch {
      setError("Utilisateur ou mot de passe incorrect");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
