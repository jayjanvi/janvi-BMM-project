import axios from "axios";

const URL = "http://localhost:5000";
class UserService {
  addUser(user) {
    return axios.post(URL+"/api/auth/addUser", user);
  }
  userList() {
    return axios.get(URL+"/api/auth/users");
  }

  deleteUser(userId) {
    return axios.delete(URL+"/api/auth/deleteUser/"+userId);
  }

  searchUsers(value) {
    return axios.post(URL+"/api/auth/findUsers",value);
  }

}

export default new UserService();