import axios from 'axios';
import Config from 'Config';


export default {
    upload: (files) => {
        const jwtToken = localStorage.getItem('appJWT');
        return axios.post(Config.apiUrl + '/api/upload', files, {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': 'Bearer ' + jwtToken
            }
        })

    }
}