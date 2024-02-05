import axios from 'axios';
import type { HttpResponse } from '@/api/interceptor';

interface ParamsProps {
    id?: number | string | unknown | undefined;
    label?: number | string | unknown | undefined;
    value?: number | string | unknown | undefined;
    parentId?: number | string;
}
export function queryCategory(params: any) {
    return axios.get<any>('/category/get', { params }).then((res) => {
        return { data: res.data[0] };
    });
}
export function addCategory(params: ParamsProps) {
    return axios.post<HttpResponse>('/category/add', params);
}
export function editCategory(params: ParamsProps) {
    return axios.post<HttpResponse>('/category/edit', params);
}

export function deleteCategory(params: ParamsProps) {
    return axios({
        method: 'post',
        url: '/category/delete',
        params,
    });
}
