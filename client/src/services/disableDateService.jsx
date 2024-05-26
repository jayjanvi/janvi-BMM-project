import axios from "axios";

const URL = "http://localhost:5000";
class disableDateService {
  addDisableDate(data) {
    return axios.post(URL+"/api/auth/addDisableDate", data);
  }
  disableDateList() {
    return axios.get(URL+"/api/auth/disableDatesList");
  }
}

export default new disableDateService();