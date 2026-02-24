import axios from 'axios'

const instance = axios.create({
    baseURL: "https://hoa-tuoi-si.onrender.com/api"
})
export default instance

