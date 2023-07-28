// import type { FormInstance } from '@arco-design/web-vue/es/form';
// import type { ArticleRecord } from '@/api/article';
import type { Options } from '@/types/global';
import type { FormItemEventHandler } from '@arco-design/web-vue/es/form';
import type {
  TableProps,
  TableColumnData,
  TableData,
  TableBorder,
  TableRowSelection,
  TableExpandable,
} from '@arco-design/web-vue/es/table/interface';

export type ProTableProps = {
  columns?: TableColumnData[] | undefined;
  data?: TableData[] | undefined;
  bordered?: boolean | TableBorder | undefined;
  rowSelection?: TableRowSelection | undefined;
  expandable?: TableExpandable | undefined;
  pagination?: boolean | undefined;
  pagePosition?: string | undefined;
  request?: ((args: any) => any) | undefined;
  scroll?: { x: number | string; y: number | string };
};
export type FormItemProps = Partial<{
  labelColFlex?: number | string;
  field: string;
  label: string;
  valueType?: string;
  span?: number;
  options?: Options[];
}>;

export interface FormEvent extends FormItemEventHandler {
  reset: (ev?: Event) => viod;
  search: (ev?: Event) => viod;
}
export type FormProp = Partial<{
  formItems: FormItemProps[];
}>;
export type CustomTableProps = Partial<
  TableProps & {
    loading: boolean;
    scroll: { x: number | string; y: number | string };
  }
>;
