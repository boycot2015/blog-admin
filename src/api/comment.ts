import axios from 'axios';
import type { Pagination } from '@/types/global';
import type { HttpResponse } from '@/api/interceptor';

export interface ArticleRecord {
    articleAbstract: '传播环境决定企业营销行为，当报纸杂志等纸质媒介、电台电视等电波媒介成为过去式，互联网、移动互联网等数';
    articleType: 'COMPANY_NEWS';
    attachmentLink: '';
    clickNum: 5040;
    clickNumMonthly: 678;
    content: '';
    coverImg: 'https://img.yunzhonghe.com/image/1677134333983JFdKXXivqf.png';
    createTime: '2023-02-23 22:39:36';
    id: 211;
    isDeleted: false;
    isRecommended: true;
    publishTime: '2023-02-23 14:40:17';
    seoDescription: '';
    seoKeyword: '企业营销,营销物资,数字化采购,发展,';
    seoTag: '企业营销,营销物资,数字化采购,发展,';
    seoTitle: '';
    seoUrl: '';
    status: true;
    thisMonth: '202307';
    title: '从企业营销层面看营销物资数字化采购发展';
    updateTime: '2023-07-26 23:14:31';
}
export interface DataResult extends Pagination {
    0: ArticleRecord[];
    1: Pagination;
}
interface ParamsProps {
    title?: string;
    type?: string;
    id?: number | string | unknown | undefined;
    content?: string;
    status?: number | string;
    category?: string;
    tagIds?: number[];
}
export function querycommentList(params: ParamsProps & Pagination) {
    if (params.size) {
        params.pageSize = params.size;
        delete params.size;
    }
    return axios.get<DataResult>('/comment/get', { params }).then((res) => {
        return { data: { records: res.data[0], total: res.data[1] } };
    });
}
export function queryCategory(params: any) {
    return axios.get<any>('/category/get', { params }).then((res) => {
        return { data: res.data[0] };
    });
}
export function queryArticle(params: ParamsProps) {
    return axios.get<any>('/comment/getById', { params }).then((res) => {
        return { data: res.data };
    });
}
export function addArticle(params: ParamsProps) {
    return axios.post<HttpResponse>('/comment/add', params);
}
export function editArticle(params: ParamsProps) {
    return axios.post<HttpResponse>('/comment/edit', params);
}

export function deletecomment(params: ParamsProps) {
    return axios({
        method: 'post',
        url: '/comment/delete',
        params,
    });
}
export function changeStatus(data: ParamsProps) {
    return axios.post<HttpResponse>('/comment/status', data);
}
