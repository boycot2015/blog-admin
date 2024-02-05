export interface TagProps {
    title: string;
    name: string;
    fullPath: string;
    path: string;
    query?: any;
    keepAlive?: boolean;
}

export interface TabBarState {
    tagList: TagProps[];
    cacheTabList: Set<string>;
}
