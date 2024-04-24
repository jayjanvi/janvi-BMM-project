import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AddBooking = () => {
  const [formData, setFormData] = useState({
    category: '',
    mealType: '',
    isWeekend: false,
    selectedDate: '',
    selectedAccount: '',
    notes: '',
    bookingCount: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log(formData);
    // Example: 
    // UserService.addBooking(formData)
    //   .then(response => {
    //     console.log(response);
    //     toast.success("Booking added successfully");
    //   })
    //   .catch(error => {
    //     console.error(error);
    //     toast.error("Failed to add booking");
    //   });
  };

  return (
    <div className="modal fade side-modal" id="addBookingModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel">
      <div className="modal-dialog modal-md" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Book a Meal</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group custom-radio">
                <label>Select Category</label>
                <div className="d-flex align-content-center justify-content-start">
                  <div className="radio-block">
                    <input type="radio" id="employees" name="category" value="Employees" checked={formData.category === 'Employees'} onChange={handleChange} />
                    <label htmlFor="employees" className="mr-0">Employees</label>
                  </div>
                  <div className="radio-block">
                    <input type="radio" id="nonEmployees" name="category" value="Non Employees" checked={formData.category === 'Non Employees'} onChange={handleChange} />
                    <label htmlFor="nonEmployees" className="mr-0">Non Employees</label>
                  </div>
                  <div className="radio-block">
                    <input type="radio" id="customBooking" name="category" value="Custom Booking" checked={formData.category === 'Custom Booking'} onChange={handleChange} />
                    <label htmlFor="customBooking" className="mr-0">Custom Booking</label>
                  </div>
                </div>
              </div>
              {/* Other form fields */}
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-primary" data-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary">Book</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};


