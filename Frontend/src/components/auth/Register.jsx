import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { registerUser } from "../../slices/authSlice";
import { StyledForm } from "./StyledForm";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordValidation, setPasswordValidation] = useState("");

  useEffect(() => {
    if (auth._id) {
      navigate("/cart");
    }
  }, [auth._id, navigate]);

  useEffect(() => {
    const fetchPasswordStrength = async (password) => {
      try {
        const response = await axios.post('http://localhost:6000/predict', { password });
        setPasswordStrength(response.data.prediction);
      } catch (error) {
        console.error("There was an error predicting the password strength!", error);
      }
    };

    if (user.password) {
      fetchPasswordStrength(user.password);
    }

    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(user.password);
    const hasNumber = /\d/.test(user.password);

    if (!hasSymbol || !hasNumber) {
      setPasswordValidation("Password must include a symbol and a numeric character");
    } else {
      setPasswordValidation("");
    }
  }, [user.password]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (passwordValidation) {
      return;
    }

    dispatch(registerUser(user));
  };

  return (
    <>
      <StyledForm onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Name"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <div className="password-strength">
          <span>Password strength: {passwordStrength}</span>
        </div>
        {passwordValidation && (
          <div className="password-validation">
            <span>{passwordValidation}</span>
          </div>
        )}
        <button disabled={auth.registerStatus === "pending"}>
          {auth.registerStatus === "pending" ? "Submitting..." : "Register"}
        </button>
        {auth.registerStatus === "rejected" && (
          <p>{auth.registerError}</p>
        )}
      </StyledForm>
    </>
  );
};

export default Register;
