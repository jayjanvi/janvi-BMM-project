// my-app/src/services/AuthService.js
import axios from "axios";

const URL = "http://localhost:5000";
class AuthService {
  login(user) {
    return axios.post(URL+"/api/auth/login", user);
  }

  logout() {
    localStorage.removeItem("user");
  }

  isAuthenticated() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.token;
  }

  changePassword(user) {
    return axios.post(URL+"/api/auth/changePassword", user);
  }
}

export default new AuthService();
