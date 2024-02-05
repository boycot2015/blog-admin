import axios from 'axios';
// import type { Pagination } from '@/types/global';
// import type { RouteRecordNormalized } from 'vue-router';
import type { HttpResponse } from '@/api/interceptor';

interface ParamsProps {
    notice?: string;
    id?: number | string;
    banner?: number | string;
    theme?: number | string;
    siteConfig?: number | string;
}

export function querySetting(params: ParamsProps) {
    return axios.get('/setting/get', { params }).then((res) => {
        return { data: res.data };
    });
}
export function updateSetting(params: ParamsProps) {
    return axios.post<HttpResponse>('/setting/edit', params);
}
