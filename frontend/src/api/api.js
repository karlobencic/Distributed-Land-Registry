import axios from 'axios';

export function axiosInstance() {
    const instance = axios.create({
        baseURL: `http://localhost:8081/api`,
    });
    instance.defaults.headers.get['Pragma'] = 'no-cache';
    instance.interceptors.response.use(
        response => response.data
    );
    return instance;
}

const instance = axiosInstance();

export default {
    land: {
        getAll: () => instance.get('/query-all'),
        getById: (id) => instance.get(`/query/${id}`),
        create: (land) => instance.post('/add', land),
        changeOwner: (id, newOwner) => instance.post(`/change-owner/${id}`, {
            owner: newOwner
        }),
    },
}
