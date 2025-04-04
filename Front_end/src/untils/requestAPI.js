import axios from "axios";

const requestApi = axios.create({
    baseURL: "https://localhost:7154/api/v1/" // hoặc chỉ "https://localhost:7154/"
  });
  

export default requestApi;
  // baseURL: "http://localhost:8000/api/v1/"

