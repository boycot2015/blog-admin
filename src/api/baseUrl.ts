/* eslint-disable import/no-mutable-exports */
/* eslint-disable default-case */
/* eslint-disable no-nested-ternary */
let baseUrl = 'http://www.blog-api.boycot.top/';
let baseServeUrl = '';
let baseWebUrl = '';
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
    baseServeUrl = 'http://gateway.test.limofang.cn';
    baseWebUrl = 'http://newweb.yunzhonghe.com';
    baseUrl = 'https://skycrane.dev.yunzhonghe.com';
    baseUrl = 'https://skycrane.show.yunzhonghe.com'; // aliyun预演环境url
    baseUrl = 'http://www.blog-api.boycot.top'; // aliyun预演环境url
    // baseUrl = 'http://doc.yunzhonghe.com/mock/422'; // mock url
    apiUrl = 'http://api.boycot.top/api'; // mock url
    break;
  case 'test':
    baseServeUrl = 'http://gateway.test.limofang.cn';
    baseWebUrl = 'http://newweb.yunzhonghe.com';
    baseUrl = 'http://skycrane.dev.yunzhonghe.com';
    break;
  case 'show':
    baseServeUrl = 'https://gateway.show.yunzhonghe.com';
    baseWebUrl = 'http://wwww.show.yunzhonghe.com';
    baseUrl = 'http://skycrane.show.yunzhonghe.com'; // aliyun预演环境url
    break;
  case 'production':
    baseServeUrl = 'https://gateway.yunzhonghe.com';
    baseWebUrl = 'https://www.yunzhonghe.com';
    baseUrl = 'https://skycrane.pro.yunzhonghe.com'; // aliyun生产环境url
    break;
}
export { baseServeUrl, baseWebUrl, apiUrl };
export default baseUrl;
