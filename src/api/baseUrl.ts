/* eslint-disable import/no-mutable-exports */
/* eslint-disable default-case */
/* eslint-disable no-nested-ternary */
let baseUrl = 'https://blog-api.boycot.top';
// const baseServeUrl = '';
// const baseWebUrl = '';
let apiUrl = 'https://api.boycot.top/api';
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
        baseUrl = '/blog-api'; // aliyun预演环境url
        // baseUrl = 'http://localhost:4000'; // aliyun预演环境url
        // baseUrl = 'http://doc.yunzhonghe.com/mock/422'; // mock url
        // apiUrl = 'http://localhost:8090/api';
        apiUrl = '/boycot-api'; // api url
        break;
    case 'test':
        baseUrl = '/blog-api';
        apiUrl = '/boycot-api'; // api url
        break;
    case 'show':
        baseUrl = '/blog-api'; // aliyun预演环境url
        apiUrl = '/boycot-api'; // api url
        break;
    case 'production':
        baseUrl = '/blog-api'; // aliyun生产环境url
        apiUrl = '/boycot-api'; // api url
        break;
}
export { apiUrl };
export default baseUrl;
