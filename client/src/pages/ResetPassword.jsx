import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { ClipLoader } from 'react-spinners';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [token, setTOken] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Access token and id here
    const params = new URLSearchParams(window.location.search);
    setTOken(params.get('token'));
    setUserId(params.get('id'));
  }, [token, userId]);

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    let newErrors = {};

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New Password is required';
    } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/.test(formData.newPassword.trim())) {
      newErrors.newPassword = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (formData.newPassword.trim() !== formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const body = {
          token: token,
          userId: userId,
          password: formData.newPassword,
        }
        setLoading(true);
        const response = await authService.resetPassword(body);
        if (response.status === 200) {
          toast.success("Password successfully changed!");
          setTimeout(() => {
            setLoading(false);
            navigate('/login');
          }, 2000);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('An error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="login-content">
        <div className="login-content-lt"></div>
        <div className="login-content-rt">
          <div className="login-box">
            <Form >
              <div className="logo-wrapper">
                <img src="src/assets/images/logo.svg" alt="Rishabh Software" />
                <span>Meal Facility</span>
              </div>
              <h3 className="login-head">Reset Password</h3>

              <Form.Group className="mb-3" >
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  name="newPassword"
                  id="password-field"
                  className="form-control"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="New Password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  isInvalid={!!errors.newPassword} />
                <span
                  onClick={togglePasswordVisibility}
                  className={`field-icon-password toggle-password ${showPassword ? 'icon-eye-open' : 'icon-eye-close'}`}
                ></span>
                <Form.Control.Feedback type="invalid">{errors.newPassword}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" >
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  name="confirmPassword"
                  id="password-field"
                  className="form-control"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  isInvalid={!!errors.confirmPassword} />
                <span
                  onClick={togglePasswordVisibility}
                  className={`field-icon-password toggle-password ${showPassword ? 'icon-eye-open' : 'icon-eye-close'}`}
                ></span>
                <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
              </Form.Group>
            </Form>
            <div className="form-group btn-container">
              <button className="btn btn-xl btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <ClipLoader color={'#ffffff'} loading={loading} size={25} />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
