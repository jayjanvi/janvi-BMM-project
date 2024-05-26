import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/authService";
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

export const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false); 

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    
    navigate("/forgotPassword");
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const response = await AuthService.login(user);
      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/");
      } else {
        toast.error("You are not registered to this service");
      }
      toast.success("Login Successfully");
      setLoading(false);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("PLease try again!");
      }
      setLoading(false);
    }

  };

  return (
    <section className="login-content">
      <div className="login-content-lt"></div>
      <div className="login-content-rt">
        <div className="login-box">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="logo-wrapper">
              <img src="src/assets/images/logo.svg" alt="Rishabh Software" />
              <span>Meal Facility</span>
            </div>
            <h3 className="login-head">Sign in to your account</h3>
            <p className="login-text">
              Enter your credentials to access your account.
            </p>
            <div className="form-group">
              <label className="control-label">Admin Email ID</label>
              <div className="input-addon">
                <input
                  className="form-control"
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="Email"
                  autoFocus
                  autoComplete="off"
                  value={user.email}
                  onChange={handleInput}
                />
                <div className="icon-after icon-green">
                  <i className="icon-check"></i>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="control-label">Password</label>
              <div className="input-addon">
                <input
                  name="password"
                  id="password-field"
                  className="form-control"
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="Password"
                  value={user.password}
                  onChange={handleInput}
                />
                <span
                  onClick={togglePasswordVisibility}
                  className={`field-icon toggle-password ${showPassword ? 'icon-eye-open' : 'icon-eye-close'}`}
                ></span>
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between">
              <div className="form-group mb-0">
                <label className="custom-checkbox mb-0">
                  <span className="checkbox__title">Remember Me</span>
                  <input className="checkbox__input" type="checkbox" />
                  <span className="checkbox__checkmark"></span>
                </label>
              </div>
              <div className="form-group mb-0">
                <div className="utility">
                  <p>
                    <a href="#" className="form-link" onClick={handleForgotPassword}>
                      Forgot Password?
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div className="form-group btn-container">
              <button className="btn btn-xl btn-primary">
                {loading ? (
                  <ClipLoader color={'#ffffff'} loading={loading} size={25} />
                ) : (
                  "Sign in"
                )}</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
