import axios from 'axios';
import type { Pagination } from '@/types/global';
import type { HttpResponse } from '@/api/interceptor';

export interface ArticleRecord {
  articleAbstract: '传播环境决定企业营销行为，当报纸杂志等纸质媒介、电台电视等电波媒介成为过去式，互联网、移动互联网等数';
  articleType: 'COMPANY_NEWS';
  attachmentLink: '';
  clickNum: 5040;
  clickNumMonthly: 678;
  content: '<p><strong>企业营销全面拥抱数字营销</strong></p>\n<p>传播环境决定企业营销行为，当报纸杂志等纸质媒介、电台电视等电波媒介成为过去式，互联网、移动互联网等数字化媒介成为大众主流传播形式，C端接受营销的形式也随之改变，企业作为营销主体，作为营销的发起者，满足、匹配C端营销喜欢的重要性不言而喻，因此，数字营销已经发展成为企业营销的重要策略。</p>\n<p><img class="wscnph" style="display: block; margin-left: auto; margin-right: auto;" title="undefined" src="https://img.yunzhonghe.com/image/1677134201116FuNiQBtQhj.png" alt="undefined" width="600" height="442" /></p>\n<p><strong>营销物资采购站在十字路口</strong></p>\n<p>如果说营销策略是武器，那么营销物资就是弹药。数字营销作为企业的营销策略，完整系统的规划了传播和触达的形式，而营销物资将承担更好的推动策略落地的价值。红包雨、大转盘、抽盲盒等数字营销工具已经被大规模采用，那么随之而来的营销物资采购也成为企业数字营销的重要一环。</p>\n<p>传统线下营销物资采购带来的&ldquo;高成本&rdquo;&ldquo;低效率&rdquo;&ldquo;不透明&rdquo;&ldquo;品类单一&rdquo;等等问题已经掣肘企业太久，数字化采购与营销物资的结合，或将为企业带来行之有效的解决方案。</p>\n<p>&nbsp;</p>\n<p><strong>数字营销与营销品采购一体化服务崭露头角</strong></p>\n<p>云中鹤作为&ldquo;营销品&rdquo;概念的提出者，在20余年的发展之中，始终在这一垂直领域深耕，并在数字化采购崛起之初就开始转型数字化业务，&ldquo;营销品供应链+数字化采购技术+履约交付+售后服务&rdquo;让云中鹤在垂直领域走的更深更强，发展至今，已服务全国中大型企业超过1000+家，服务C端客户超过10000万+，&ldquo;营销品集采第一个品牌&rdquo;的服务能力获得业界广泛认可。</p>\n<p>同时，在数字营销全案策划、营销设计、新媒体运营、数字营销工具定制开发等服务层面提供全流程、全周期服务，形成从&ldquo;数字营销服务&rdquo;到&ldquo;营销物资数字化采购&rdquo;的闭环，为银行、保险、酒业等行业的企业客户提供一站式服务。</p>';
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
interface paramsProps {
  title?: string;
  id?: number | string | unknown | undefined;
  content?: string;
  category?: string;
  tagIds?: number[];
}
export function queryArticleList(params: paramsProps & Pagination) {
  return axios.get<DataResult>('/article', { params }).then((res) => {
    return { data: { records: res.data[0], total: res.data[1] } };
  });
}
export function queryArticle(params: paramsProps) {
  return axios.get<any>('/article/getById', { params }).then((res) => {
    return { data: res.data };
  });
}
export function addArticle(params: paramsProps) {
  return axios.post<HttpResponse>('/article/add', params);
}
export function editArticle(params: paramsProps) {
  return axios.post<HttpResponse>('/article/update', params);
}
export function deleteArticle(params: paramsProps) {
  return axios({
    method: 'post',
    url: '/article/delete',
    params,
  });
}
