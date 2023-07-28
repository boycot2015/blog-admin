import type { Options } from '@/types/global';
import type { FormItemEventHandler } from '@arco-design/web-vue/es/form';

export type FormItemProps = {
  labelColFlex?: number | string;
  field: string;
  label: string;
  valueType?: string;
  attrs?: any;
  span?: number;
  options?: Options[];
};

export interface FormEvent extends FormItemEventHandler {
  reset: (ev?: Event) => viod;
  search: (ev?: Event) => viod;
}

export type CustomTableProps = Partial<
  TableProps & {
    loading: boolean;
    scroll: { x: number | string; y: number | string };
  }
>;
