import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const Login = (props) => {
  const setAlert = props.setAlert || (() => {});
  const [cre, setCre] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const onChange = (e) => {
    setCre({ ...cre, [e.target.name]: e.target.value });
  };

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(cre.email, cre.password);
    
    if (result.success) {
      navigate("/"); // ✅ redirect home
      setAlert("Successfully logged in!", "success");
    } else {
      console.log("Invalid credentials!");
      // alert("Invalid email or password");
      // props.setAlert("Covert to Upeer Case is Successful  ✅ ! " , "success")
  setAlert("Invalid credentials!", "danger");
    }
  };

  return (
    <div className="container mx-2 my-5">
      <form onSubmit={handleSubmit}>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">
            Email address
          </label>
          <input
            type="email"
            class="form-control"
            id="email"
            aria-describedby="emailHelp"
            onChange={onChange}
            name="email"
          />
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">
            Password
          </label>
          <input
            type="password"
            class="form-control"
            id="password"
            onChange={onChange}
            name="password"
          />
        </div>
        <button  type="submit" class="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
