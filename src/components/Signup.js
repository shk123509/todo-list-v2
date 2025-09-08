import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
  const setAlert = props.setAlert || (() => {});
  const [cre, setCre] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const navigate = useNavigate();
  const onChange = (e) => {
    setCre({ ...cre, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: cre.name,
        email: cre.email,
        password: cre.password,
      }),
    });

    const json = await response.json();
    console.log(json);

    if (json.authtoken) {
      localStorage.setItem("token", json.authtoken);
      navigate("/"); // ✅ redirect home
  setAlert("Your account create successfuly", "success");
    } else {
      console.log("Invalid credentials!");
      // alert("Invalid email or password");
      // props.setAlert("Covert to Upeer Case is Successful  ✅ ! " , "success")
  setAlert("Invalid credentials!", "danger");
    }
  };
  return (
    <>
      <h2>Create an account to use Inootbook-websites !</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            onChange={onChange}
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={cre.name}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            name="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            onChange={onChange}
            value={cre.email}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            minLength={6}
            required
            onChange={onChange}
            value={cre.password}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="cpassword"
            name="cpassword"
            minLength={6}
            required
            onChange={onChange}
            value={cre.cpassword}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </>
  );
};

export default Signup;
