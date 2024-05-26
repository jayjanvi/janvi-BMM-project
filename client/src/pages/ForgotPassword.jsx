import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import authService from '../services/authService';
import { toast } from "react-toastify";

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false); 

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log('Submitting email:', email);
  
    
    if (!email.trim()) {
      toast.error('Email is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Email is invalid');
      return;
    }

    try {
      
      const body={
         email:email,
      }
      setLoading(true);
      
      const response = await authService.forgotPassword(body);
      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data));
        setTimeout(() => {
        toast.success('Password reset instructions sent to your email.');
        setLoading(false);
          },2000);
      } else {
        toast.error(response.data.message); 
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again later.');
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
            <h3 className="login-head">Forgot Password?</h3>
            <p className="login-text">Enter the email below to continue.</p>
            <div className="form-group">
              <label className="control-label">Email</label>
              <div className="input-addon">
                <input
                  className="form-control"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="Enter Your Email"
                  autoFocus
                />
                
                {error && <div className="icon-after icon-red"><i className="icon-error"></i></div>}
              </div>
              
              {error && <div className="error-message">{error}</div>}
           
              {successMessage && <div className="success-message">{successMessage}</div>}
            </div>
            <div className="form-group btn-container">
              <button className="btn btn-xl btn-primary">
              {loading ? (
                  <ClipLoader color={'#ffffff'} loading={loading} size={25} />
                ) : (
                  "Submit"
                )}
                </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
