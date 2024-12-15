import axios from 'axios';
import {resolveEnvPrefix} from "vite";

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: false, // This is the default
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

export default {
    getCollections() {
        const response = apiClient.get('/collections');

        return response;
    },
    async getCollection(id:string) {
        const response = await apiClient.get(`/collections/${id}`);
        return response.data;
    },
    async startTest(id:string){
        const response = await apiClient.post('/startPractice?collection='+id);
        return response.data;
    },
    async finishPractice(id:string, isPassed:boolean){
        console.log(isPassed, id);
        const response = await apiClient.post('/endPractice?collection=' + id, {
            isPassed: isPassed
        });
        return response.data;
    }

};