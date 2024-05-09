import axios from "axios";

const URL = "http://localhost:5000";
class UserService {
  addBooking(booking) {
    return axios.post(URL+"/api/auth/addBooking", booking);
  }
  bookingList() {
    return axios.get(URL+"/api/auth/bookings");
  }
}

export default new UserService();