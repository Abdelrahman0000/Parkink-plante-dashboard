// src/components/Login.jsx
import { useState } from "react";
import { useMutation } from "react-query";
import { login } from "../../../api/auth";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ Email: "", Password: "" });
  const navigate = useNavigate();

  const mutation = useMutation(login, {
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          name: data.name,
          roles: data.roles,
        })
      );
      navigate("/");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials and try again.");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(credentials);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="Email"
        value={credentials.Email}
        onChange={handleChange}
        placeholder="E-Mail Address"
        className="input-group "
        required
      />
      <input
        type="password"
        name="Password"
        value={credentials.Password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <div className="btn-container">
        {" "}
        <button type="submit">Login</button>
      </div>
    </form>
  );
};

export default LoginForm;
