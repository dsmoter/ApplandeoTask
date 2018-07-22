import axios from 'axios';
import Config from 'Config';

export default {
    login: (credentials) => axios.post(Config.apiUrl + '/api/auth', { credentials }),
    checkAuth: (token) => axios.post(Config.apiUrl + '/api/validate', { token })
}