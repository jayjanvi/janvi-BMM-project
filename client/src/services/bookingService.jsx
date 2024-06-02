import axios from "axios";

const URL = "http://localhost:5000";
class UserService {
  addBooking(booking) {
    return axios.post(URL + "/api/auth/addBooking", booking);
  }
  bookingList(data) {
    return axios.post(URL + "/api/auth/bookings", data);
  }
  deleteBooking(bookingId) {
    return axios.delete(URL + "/api/auth/deleteBooking/" + bookingId);
  }
  bookingListByDate(data) {
    return axios.post(URL + "/api/auth/calendar", data);
  }
}

export default new UserService();