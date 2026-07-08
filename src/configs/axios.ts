import axios from 'axios'

const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`
    // baseURL: "http://localhost:8080/api"
    
})
export default instance