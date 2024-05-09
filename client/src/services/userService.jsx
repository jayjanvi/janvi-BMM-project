import axios from "axios";

const URL = "http://localhost:5000";
class UserService {
  addUser(user) {
    return axios.post(URL+"/api/auth/addUser", user);
  }
  userList() {
    return axios.get(URL+"/api/auth/users");
  }

  searchUsers(value) {
    return axios.post(URL+"/api/auth/findUsers",value);
  }

}

export default new UserService();