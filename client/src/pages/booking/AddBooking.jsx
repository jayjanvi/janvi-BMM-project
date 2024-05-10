import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { ClipLoader } from 'react-spinners';
import "react-datepicker/dist/react-datepicker.css";
import bookingService from "../../services/bookingService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import userService from "../../services/userService";

export const AddBooking = ({ isOpen, handleClose }) => {

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [noteShow, setNoteShow] = useState(false);
  const [countShow, setCountShow] = useState(false);

  const [userList, setUserList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);

  const [bookingCategoryShow, setBookingCategory] = useState(false);
  const [employeeListShow, setEmployeeListShow] = useState(false);
  const [loading, setLoading] = useState(false); // State for spinner loading

  const [formData, setFormData] = useState({
    category: 'employees',
    mealType: '',
    startDate: '',
    endDate: '',
    bookingCategory: '',
    notes: '',
    bookingCount: '',
    employee: []
  });

  // Handle search input change
  const handleSearchInputChange = (e) => {
    fetchUsers(e.target.value.toLowerCase());
    setSearchQuery(e.target.value);
  };

  const updateFormVisibility = () => {
    const { category } = formData;
    setShowSearchBar(category === 'employees');
    setEmployeeListShow(category === 'employees');
    setNoteShow(category !== 'employees');
    setCountShow(category !== 'employees');
    setBookingCategory(category === 'custom_booking');
  };

  useEffect(() => {
    updateFormVisibility();
    fetchUsers();
  }, [formData.category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value, //selectedDate: date
    }));
  };

  const handleCheckboxChange = (e, user) => {
    const { checked } = e.target;
    const { _id } = user;

    setFormData(prevState => ({
      ...prevState,
      employee: checked
        ? [...prevState.employee, _id]
        : prevState.employee.filter(emp => emp !== _id)
    }));
  };

  // fetch user list
  const fetchUsers = async (value) => {
    try {
      const response = await userService.searchUsers({ value: value });
      setUserList(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    bookingService.addBooking(formData)
      .then(response => {
        setTimeout(() => {
          handleClose();
          window.location.reload();
          setLoading(false);
        }, 2000);
        toast.success("Booking added successfully");
      })
      .catch(error => {
        toast.error("Failed to add booking");
        setLoading(false);
      });
  };

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // Sunday = 0, Saturday = 6
  };

  return (
    <div className={`modal fade side-modal ${isOpen ? 'show' : ''}`} id="addBookingModal">
      <div className="modal-dialog modal-md" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Book a Meal</h5>
            <button type="button" className="close" onClick={handleClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group custom-radio">
                <label>Select Category</label>
                <div className="d-flex align-content-center justify-content-start">
                  <div className="radio-block">
                    <input type="radio" id="employees" name="category" value="employees" checked={formData.category === 'employees'} onChange={handleChange} />
                    <label htmlFor="employees" className="mr-0">Employees</label>
                  </div>
                  <div className="radio-block">
                    <input type="radio" id="nonEmployees" name="category" value="non_employees" checked={formData.category === 'non_employees'} onChange={handleChange} />
                    <label htmlFor="nonEmployees" className="mr-0">Non Employees</label>
                  </div>
                  <div className="radio-block">
                    <input type="radio" id="customBooking" name="category" value="custom_booking" checked={formData.category === 'custom_booking'} onChange={handleChange} />
                    <label htmlFor="customBooking" className="mr-0">Custom Booking</label>
                  </div>
                </div>
              </div>

              <div className="form-group custom-radio">
                <label>Select Meal Type</label>
                <div className="d-flex align-content-center justify-content-start">
                  <div className="radio-block">
                    <input type="radio" id="lunch" name="mealType" value="Lunch" checked={formData.mealType === 'Lunch'} onChange={handleChange} />
                    <label htmlFor="lunch" className="mr-0">Lunch</label>
                  </div>
                  <div className="radio-block">
                    <input type="radio" id="dinner" name="mealType" value="Dinner" checked={formData.mealType === 'Dinner'} onChange={handleChange} />
                    <label htmlFor="dinner" className="mr-0">Dinner</label>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Select Date (s)</label>
                <div className="input-group date-picker-input">

                  <DatePicker
                    startDate={startDate}
                    id={"datepicker-input"}
                    endDate={endDate}
                    onChange={(dates) => {
                      const [start, end] = dates;
                      setStartDate(start);
                      setEndDate(end);
                      setFormData(prevState => ({
                        ...prevState,
                        startDate: start,
                        endDate: end,
                      }));
                    }}
                    selectsRange
                    dateFormat="dd-MM-yyyy"
                    minDate={new Date()}
                    filterDate={isWeekday}
                    placeholderText="Select Date Range"
                    className="form-control border-right-0 datepicker-icn" />

                  <div className="input-group-append bg-transparent">
                    <span className="input-group-text bg-transparent" id="basic-addon2">
                      <i className="icon-calendar" onClick={() => document.getElementById('datepicker-input').focus()}></i></span>
                  </div>
                </div>
              </div>
              {bookingCategoryShow && <div className="form-group">
                <label>Booking Category Name </label>
                <input type="text" className="form-control" placeholder="Add Booking Category" name="bookingCategory" value={formData.bookingCategory} onChange={handleChange} />
              </div>}
              {noteShow && <div className="form-group">
                <label>Notes</label>
                <textarea className="form-control" rows="4" placeholder="Type here.." name="notes" value={formData.notes} onChange={handleChange}></textarea>
              </div>}



              {/* Conditionally render search bar */}
              {showSearchBar && (
                <div className="form-group">
                  <label>Select User</label>
                  <div className="search-wrapper">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search User.."
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                    />
                    <i className="icon-search search-icon"></i>
                  </div>
                </div>
              )}
              {countShow && <div className="form-group">
                <label>Booking Count</label>
                <input type="text" className="form-control" placeholder="100" name="bookingCount" value={formData.bookingCount} onChange={handleChange} />
              </div>}


              {employeeListShow && <div className="form-group">
                <label>Select Employees</label>
                <div className="table-responsive">
                  <table className="table table-hover responsive nowrap table-bordered">
                    <thead>
                      <tr>
                        <th> </th>
                        <th>Employee ID</th>
                        <th>Employee Name</th>
                        <th>Department</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userList && userList.map((user) => (
                        <tr key={user._id}>
                          <td>
                            <div className="form-group mb-0">
                              <label className="custom-checkbox m-0">
                                <input
                                  className="checkbox__input"
                                  type="checkbox"
                                  name={`employee-${user._id}`} // Unique name for each checkbox
                                  checked={formData.employee.includes(user._id)} // Check if user's _id is in employee array
                                  onChange={(e) => handleCheckboxChange(e, user)} // Pass user object to handleCheckboxChange
                                />
                                <span className="checkbox__checkmark"></span>
                              </label>
                            </div>
                          </td>
                          <td>{user.code}</td>
                          <td>{user.username}</td>
                          <td>{user.department}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>}
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-primary" onClick={handleClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              {loading ? (
                <ClipLoader color={'#ffffff'} loading={loading} size={25} />
              ) : (
                "Book"
              )}</button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
