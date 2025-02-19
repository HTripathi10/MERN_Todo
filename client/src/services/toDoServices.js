import axios from 'axios';
import { getUserDetails } from '../util/GetUser';

const SERVER_URL = 'http://localhost:5000/api/todo';

const authHeaders = () => {
    let userToken = getUserDetails()?.token;
    return {headers:{'Authorization':userToken}};
}

const createToDo = (data) =>{
    // Ensure required fields are present
    if (!data.status) {
        data.status = 'ACTIVE';
    }
    if (!data.deadline) {
        data.deadline = new Date();
    }
    return axios.post(SERVER_URL+'/create-to-do',data,authHeaders());
}

const getAllToDo = (userId) =>{
    return axios.get(SERVER_URL+'/get-all-to-do/'+userId,authHeaders());
}

const deleteToDo = (id) =>{
    return axios.delete(SERVER_URL+'/delete-to-do/'+id,authHeaders());
}

const updateToDo = (id,data) =>{
    // Validate status if provided
    if (data.status && !['ACTIVE','IN_PROGRESS','COMPLETE','EXPIRED'].includes(data.status)) {
        throw new Error('Invalid status value');
    }
    return axios.patch(SERVER_URL+'/update-to-do/'+id,data,authHeaders());
}

const ToDoservices = {
    createToDo,
    getAllToDo,
    deleteToDo,
    updateToDo
}

export default ToDoservices;