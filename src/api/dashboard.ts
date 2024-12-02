import axios from 'axios';
// import type { TableData } from '@arco-design/web-vue/es/table/interface';
// import type { HttpResponse } from '@/api/interceptor';
import type { RouteLocationRaw } from 'vue-router';

export type ContentData = {
    currentTime: number;
    deadline?: number;
    deadTitle: string;
    newLeast?: [
        {
            id: number;
            title: string;
            isDelete: true;
            content: null;
            url: string;
            img: string;
            categoryName: null;
            status: 1001;
            visitor: null;
            createTime: string;
            updateTime: string;
            comment: [];
        }
    ];
    categoryCount?: number;
    tagCount?: number;
    publicData?: {
        total?: number;
        data?: [
            {
                time: string;
                value: number;
            }
        ];
    };
    visitorData?: {
        total?: number;
        data?: [
            {
                time: string;
                value: number;
            }
        ];
    };
    total: number;
};
export interface ContentDataRecord {
    title: string;
    prop: string;
    value: number;
    link: RouteLocationRaw;
    imgUrl: string;
    icon?: () => any;
}

export function queryContentData() {
    return Promise.all([
        axios.get<ContentData>('/datas'),
        axios.get<ContentData>('/statics'),
    ]).then(([res, statics]: any) => {
        return {
            data: {
                ...statics.data,
                ...res.data,
                category: statics.data?.categoryCount,
                tag: statics.data?.tagCount,
            },
        };
    });
}
export function queryStaticsData() {
    return axios.get<ContentData>('/statics').then((statics: any) => {
        return {
            data: statics.data,
        };
    });
}
export interface PopularRecord {
    id: number;
    title: string;
    isDelete: true;
    content: null;
    url: string;
    img: string;
    categoryName: null;
    status: 1001;
    visitor: null;
    createTime: string;
    updateTime: string;
    comment: [];
}
export type PopularResult = {
    records: PopularRecord[];
    newLeast: PopularRecord[];
};
export function queryPopularList() {
    return axios.get<PopularResult>('/datas').then((res) => {
        return { data: { records: res.data?.newLeast } };
    });
}
