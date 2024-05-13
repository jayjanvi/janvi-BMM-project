import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import authService from '../services/authService';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false); // State for spinner loading

  const handleChange = (e) => {
    setEmail(e.target.value);
    // Clear error message when user starts typing
    setError('');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log('Submitting email:', email);
  
    // Validate email format
    if (!email.trim()) {
      setError('Email is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return;
    }

    try {
      // Call the forgot password API
      const body={
        
        email:email,
      }
      setLoading(true);
      const response = await authService.forgotPassword(body);
      if (response.status === 200) {
        setSuccessMessage('Password reset instructions sent to your email.');
        setLoading(false);
      } else {
        setError(response.data.message); // Display error message if API response indicates an error
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
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
                {/* Display success icon if email is valid */}
                {error && <div className="icon-after icon-red"><i className="icon-error"></i></div>}
              </div>
              {/* Display error message */}
              {error && <div className="error-message">{error}</div>}
              {/* Display success message */}
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
