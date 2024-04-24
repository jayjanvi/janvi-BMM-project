import { useState } from "react";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import bcrypt from 'bcryptjs-react'
import authService from "../services/authService";

export const ChangePassword = ({ show, handleClose }) => {

    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});

    const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors = {};

        const password = JSON.parse(localStorage.getItem('user')).password;
        const passwordMatch = await bcrypt.compare(formData.oldPassword, password);

        // Validation logic
        if (!formData.oldPassword.trim()) {
            newErrors.oldPassword = 'Old Password is required';
        } else if (!passwordMatch) {
            newErrors.oldPassword = 'Old Password is incorrect';
        }

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
        console.log(formData);

        // If there are no errors, create the user
        if (Object.keys(newErrors).length === 0) {
            try {
                const user = {
                    userId: JSON.parse(localStorage.getItem('user')).userId,
                    password: formData.newPassword
                }
                console.log(user);
                const response = await authService.changePassword(user);
                if (response.status === 200) {
                    setShow(true);
                    localStorage.setItem("user", JSON.stringify(response.data));
                    alert("Password change succesfully");
                } else {
                    alert("Sorry!!!")
                }
            } catch (error) {
                alert(error.response.data.message);
            }
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Change Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="oldPassword">
                        <Form.Label>Old Password</Form.Label>
                        <Form.Control
                            name="password"
                            id="password-field"
                            className="form-control"
                            type={showPassword ? "text" : "password"} // Toggle password visibility
                            required
                            placeholder="Old Password"
                            value={formData.password}
                            onChange={handleChange}
                            isInvalid={!!errors.password} />
                        <span
                            onClick={togglePasswordVisibility} // Add onClick event to toggle password visibility
                            className={`field-icon-password toggle-password ${showPassword ? 'icon-eye-open' : 'icon-eye-close'}`}
                        ></span>
                        <Form.Control.Feedback type="invalid">{errors.oldPassword}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="newPassword">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                         name="newPassword"
                         id="password-field"
                         className="form-control"
                         type={showPassword ? "text" : "password"} // Toggle password visibility
                         required
                         placeholder="New Password"
                         value={formData.newPassword}
                         onChange={handleChange}
                         isInvalid={!!errors.newPassword} />
                     <span
                         onClick={togglePasswordVisibility} // Add onClick event to toggle password visibility
                         className={`field-icon-password toggle-password ${showPassword ? 'icon-eye-open' : 'icon-eye-close'}`}
                     ></span>
                        <Form.Control.Feedback type="invalid">{errors.newPassword}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                             name="confirmPassword"
                             id="password-field"
                             className="form-control"
                             type={showPassword ? "text" : "password"} // Toggle password visibility
                             required
                             placeholder="Confirm Password"
                             value={formData.confirmPassword}
                             onChange={handleChange}
                             isInvalid={!!errors.ChangePassword} />
                         <span
                             onClick={togglePasswordVisibility} // Add onClick event to toggle password visibility
                             className={`field-icon-password toggle-password ${showPassword ? 'icon-eye-open' : 'icon-eye-close'}`}
                         ></span>
                        <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Change
                </Button>
            </Modal.Footer>
        </Modal>

    );
};