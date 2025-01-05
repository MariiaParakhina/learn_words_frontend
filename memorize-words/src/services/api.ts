import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: false, // This is the default
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

export default {
    async getWords(collectionId: string) {
        if (collectionId) {
            const response = await apiClient.get(`/words?collection=${collectionId}`);
            return response.data;
        }
    },
    getCollections() {
        const response = apiClient.get('/collections');

        return response;
    },
    async getCollection(id:string) {

        if(id) {
            const response = await apiClient.get(`/collections/${id}`);

            return response.data;
        }
    },
    async deleteCollection(id:string) {
        const response = await apiClient.delete(`/collections/${id}`);
        return response.data;
    },
    async addCollection(collectionData:any) {
        const response = await apiClient.post('/collections', collectionData);
        return response;
    },
    async addWords(collectionId:string, words:any) {
        const response = await apiClient.post(`/words?collection=${collectionId}`, words);
        return response;
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