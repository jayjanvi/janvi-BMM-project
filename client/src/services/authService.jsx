import axios from "axios";

const URL = "http://localhost:5000";
class AuthService {
  login(user) {
    return axios.post(URL + "/api/auth/login", user);
  }

  logout() {
    localStorage.removeItem("user");
  }

  isAuthenticated() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.token;
  }

  changePassword(user) {
    return axios.post(URL + "/api/auth/changePassword", user);
  }

  forgotPassword(email) {
    return axios.post(URL + "/api/auth/forgotPassword", email);
  }

  resetPassword(data) {
    return axios.post(URL + "/api/auth/resetPassword", data);
  }

}

export default new AuthService();
