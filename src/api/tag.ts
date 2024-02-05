import axios from 'axios';
import type { HttpResponse } from '@/api/interceptor';

interface ParamsProps {
    id?: number | string | unknown | undefined;
    label?: number | string | unknown | undefined;
    value?: number | string | unknown | undefined;
    parentId?: number | string;
}
export function queryTag(params: any) {
    return axios.get<any>('/tag/get', { params }).then((res) => {
        return { data: res.data[0] };
    });
}
export function addTag(params: ParamsProps) {
    return axios.post<HttpResponse>('/tag/add', params);
}
export function editTag(params: ParamsProps) {
    return axios.post<HttpResponse>('/tag/edit', params);
}

export function deleteTag(params: ParamsProps) {
    return axios({
        method: 'post',
        url: '/tag/delete',
        params,
    });
}
