import axios from 'axios';

const SERVER_URL = 'http://localhost:5000/api';

const registerUser = (data) =>{
    return axios.post(SERVER_URL+'/register',data);
}

const loginUser = (data) =>{
    return axios.post(SERVER_URL+'/login',data);
}

const resetPassword = ({ userId, newPassword }) => {
  return axios.post(SERVER_URL + '/password-reset/reset-password', {
    userId,
    newPassword
  });
};

const Authservices = {
    registerUser,
    loginUser,
    resetPassword
}

export default Authservices;