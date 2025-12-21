import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css"; 

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


      sessionStorage.setItem("username", username);
      sessionStorage.setItem("password", password);

      navigate("/tables");

  };

   return (
   <div className="login-container">
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="flex-row">
        <label className="lf--label" htmlFor="username">
          👤
        </label>
        <input
          id="username"
          className="lf--input"
          placeholder="Username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>

      <div className="flex-row">
        <label className="lf--label" htmlFor="password">
          🔒
        </label>
        <input
          id="password"
          className="lf--input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <input className="lf--submit" type="submit" value="LOGIN" />
    </form>

  </div>
   );
  }