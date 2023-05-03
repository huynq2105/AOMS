import axios from 'axios';
import { getEnvVars } from '../Environment';
const { apiUrl } = getEnvVars();

const axiosInstanceUpload = axios.create({
  baseURL: apiUrl,
  withCredentials: true, 
  headers: { 'Content-Type': 'multipart/form-data'}
});

export default axiosInstanceUpload;
