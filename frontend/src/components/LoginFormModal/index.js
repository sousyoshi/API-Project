import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const demoUser = () => {
    return dispatch(sessionActions.login({ credential: "DemoUser", password: "password" })).then(closeModal);
  };

  return (
    <>
      {" "}
      <div className="loginDiv">
        <h1>Log In</h1>
        <form className="loginForm" onSubmit={handleSubmit}>
          <label>
            <input
              placeholder="Username or Email"
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </label>

          <label>
            <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {errors.credential && <p className="errors">{errors.credential}</p>}
          <button className="loginButton" type="submit" disabled={credential.length < 4 || password.length < 6}>
            Log In
          </button>
        <button className='demoUser' onClick={demoUser}>Demo User</button>
        </form>{" "}
      </div>
    </>
  );
}

export default LoginFormModal;
