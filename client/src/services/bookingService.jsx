import axios from "axios";

const URL = "http://localhost:5000";
class UserService {
  addBooking(booking) {
    return axios.post(URL+"/api/auth/addBooking", booking);
  }
  bookingList(isEmployee) {
    return axios.post(URL+"/api/auth/bookings", isEmployee);
  }
  deleteBooking(bookingId) {
    return axios.delete(URL+"/api/auth/deleteBooking/"+bookingId);
  }
}

export default new UserService();