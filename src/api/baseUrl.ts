/* eslint-disable import/no-mutable-exports */
/* eslint-disable default-case */
/* eslint-disable no-nested-ternary */
let baseUrl = 'http://www.blog-api.boycot.top/';
// const baseServeUrl = '';
// const baseWebUrl = '';
let apiUrl = 'http://api.boycot.top/api';
// console.log(import.meta.env.MODE, 'import.meta.env.VITE_API_BASE_URL');
const env =
    import.meta.env.MODE === 'development'
        ? 'development'
        : import.meta.env.VITE_API_BASE_URL === 'show'
        ? 'show'
        : import.meta.env.VITE_API_BASE_URL === 'test'
        ? 'test'
        : 'production';
switch (env) {
    case 'development':
        baseUrl = 'http://www.blog-api.boycot.top'; // aliyun预演环境url
        // baseUrl = 'http://localhost:4000'; // aliyun预演环境url
        // baseUrl = 'http://doc.yunzhonghe.com/mock/422'; // mock url
        // apiUrl = 'http://localhost:8090/api';
        apiUrl = 'http://api.boycot.top/api'; // api url
        break;
    case 'test':
        baseUrl = 'http://www.blog-api.boycot.top/';
        apiUrl = 'http://api.boycot.top/api'; // api url
        break;
    case 'show':
        baseUrl = 'http://www.blog-api.boycot.top'; // aliyun预演环境url
        apiUrl = 'http://api.boycot.top/api'; // api url
        break;
    case 'production':
        baseUrl = 'http://www.blog-api.boycot.top'; // aliyun生产环境url
        apiUrl = 'http://api.boycot.top/api'; // api url
        break;
}
export { apiUrl };
export default baseUrl;
