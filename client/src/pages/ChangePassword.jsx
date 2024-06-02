import { useState } from "react";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import bcrypt from 'bcryptjs-react'
import { ClipLoader } from 'react-spinners';
import authService from "../services/authService";
import { toast } from "react-toastify";

export const ChangePassword = ({ show, handleClose }) => {

    const initialFormData = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    };
    const [formData, setFormData] = useState(initialFormData);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
            setLoading(false);
        } else if (!passwordMatch) {
            newErrors.oldPassword = 'Old Password is incorrect';
            setLoading(false);
        }

        if (!formData.newPassword.trim()) {
            newErrors.newPassword = 'New Password is required';
            setLoading(false);
        } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/.test(formData.newPassword.trim())) {
            newErrors.newPassword = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit';
            setLoading(false);
        }

        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Confirm Password is required';
            setLoading(false);
        } else if (formData.newPassword.trim() !== formData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Passwords do not match';
            setLoading(false);
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setLoading(true);
            try {
                const user = {
                    userId: JSON.parse(localStorage.getItem('user')).userId,
                    password: formData.newPassword
                };
                console.log(user);
                const response = await authService.changePassword(user);
                if (response.status === 200) {

                    toast.success("Password changed successfully!");
                    setTimeout(() => {
                        localStorage.setItem("user", JSON.stringify(response.data));
                        handleClose();
                        setFormData(initialFormData);
                        setLoading(false);
                    }, 2000);
                } else {
                    toast.error("Sorry!!!");
                    setLoading(false);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "An unexpected error occurred");
                setLoading(false);
            }
        }
    };

    const handleModalClose = () => {
        handleClose();
        setFormData(initialFormData);
        setLoading(false);
    };

    return (
        <Modal show={show} onHide={handleModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>Change Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" id="oldPassword">
                        <Form.Label>Old Password</Form.Label>
                        <Form.Control
                            name="oldPassword"
                            id="password-field"
                            className="form-control"
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Old Password"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            isInvalid={!!errors.oldPassword} />
                        <span
                            onClick={togglePasswordVisibility}
                            className={`field-icon-passwordCP toggle-password ${showPassword ? 'icon-eye-open' : 'icon-eye-close'}`}
                        ></span>
                        <Form.Control.Feedback type="invalid">{errors.oldPassword}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" id="newPassword">
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
                            className={`field-icon-passwordCP toggle-password ${showPassword ? 'icon-eye-open' : 'icon-eye-close'}`}
                        ></span>
                        <Form.Control.Feedback type="invalid">{errors.newPassword}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" id="confirmPassword">
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
                            isInvalid={!!errors.ChangePassword} />
                        <span
                            onClick={togglePasswordVisibility}
                            className={`field-icon-passwordCP toggle-password ${showPassword ? 'icon-eye-open' : 'icon-eye-close'}`}
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
                    {loading ? (
                        <ClipLoader color={'#ffffff'} loading={loading} size={25} />
                    ) : (
                        "Change"
                    )}
                </Button>
            </Modal.Footer>
        </Modal>

    );
};