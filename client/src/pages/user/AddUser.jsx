import { useState,useEffect } from "react";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ClipLoader } from 'react-spinners';
import UserService from "../../services/userService";
import { ToastContainer, toast } from 'react-toastify';
// import { departmentList } from "../../../../server/controllers/depatment-controller";

export const AddUser = ({ show, handleClose, onAddUser }) => {
  const initialFormData = {
    username: "",
    email: "",
    phone: "",
    password: "",
    isEmployee: "false",
    department: "",
  };
  const [loading, setLoading] = useState(false); // State for spinner loading
  const [formData, setFormData] = useState(initialFormData);

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    isEmployee: false,
    department: "",
  });

  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reloading
    

    // Perform validation
    let newErrors = {};
    

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      setLoading(false);
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must have at least 3 characters";
    } else if (formData.username.trim().length > 255) {
      newErrors.username = "Username must not have more than 255 characters";
      setLoading(false);
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      setLoading(false);
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = "Invalid email address";
      setLoading(false);
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      setLoading(false);
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Phone number must be exactly 10 digits";
      setLoading(false);
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      setLoading(false);
    } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/.test(formData.password.trim())) {
      newErrors.password = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit";
    }

    if (formData.isEmployee === "true" && !formData.department.trim()) {
      newErrors.department = "Department is required";
      setLoading(false);
    }

    setErrors(newErrors);

    // If there are no errors, create the user
    if (Object.keys(newErrors).length === 0) {
      setLoading(true); 
      try {
      
        const response = await UserService.addUser(formData);
        if (response.status === 200) {
          await sendEmail(formData.email, formData.password);
          toast.success("User added successfully!");
          setTimeout(() => {
          handleClose();
          setFormData(initialFormData);
          window.location.reload();
           setLoading(false);
          },2000);
        } else {
          toast.error("Sorry! User not created");
          setLoading(false);
        }
       
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
          setLoading(false);
        }
      }
    }
  };

  // const sendEmail = async (email, password) => {
  //   try {
  //     const response = await authService.forgotPassword({ email, password });
  //     if (response.status === 200) {
  //       console.log('Email sent successfully');
  //     } else {
  //       console.error('Failed to send email:', response.data.message);
  //       throw new Error(response.data.message);
  //     }
  //   } catch (error) {
  //     console.error('Error sending email:', error);
  //     throw new Error('Failed to send email');
  //   }
  // };

  const handleModalClose = () => {
    handleClose();
    setFormData(initialFormData);
    setLoading(false); // Reset form data after closing the modal
  };


  return (
    <>
      <Modal show={show} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                isInvalid={!!errors.username}
              />
              <Form.Control.Feedback type="invalid">
                {errors.username}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                isInvalid={!!errors.phone}
                maxLength={10}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                className="form-control"
                type={showPassword ? "text" : "password"} // Toggle password visibility
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
              />
              <span
                onClick={togglePasswordVisibility} // Add onClick event to toggle password visibility
                className={`field-icon-password toggle-password ${showPassword ? 'icon-eye-open' : 'icon-eye-close'}`}
              ></span>
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="isEmployee">
              <Form.Label>Is Employee : </Form.Label>
              <Form.Check
                inline
                type="radio"
                label="Yes"
                id="inline-radio-1"
                name="isEmployee"
                value="true"
                checked={formData.isEmployee === "true"}
                onChange={handleChange}
              />
              <Form.Check
                inline
                type="radio"
                label="No"
                id="inline-radio-2"
                name="isEmployee"
                value="false"
                checked={formData.isEmployee === "false"}
                onChange={handleChange}
              />
            </Form.Group>
            {formData.isEmployee === "true" && (
              <Form.Group className="mb-3" controlId="department">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  isInvalid={!!errors.department} />
                <Form.Control.Feedback type="invalid">
                  {errors.department}
                </Form.Control.Feedback>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
          {loading ? (
              <ClipLoader color={'#ffffff'} loading={loading} size={25} />
            ) : (
              "Add"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>

  );
};