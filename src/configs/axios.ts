import axios from 'axios'

const instance = axios.create({
    // baseURL: "https://hoa-tuoi-si.onrender.com/api"
    baseURL: "http://localhost:8080/api"
})
export default instance

