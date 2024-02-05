import type { Options } from '@/types/global';
import type {
    FormItemEventHandler,
    FieldRule,
} from '@arco-design/web-vue/es/form';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';

export type FormItemProps = {
    tooltip?: string;
    showColon?: boolean;
    noStyle?: boolean;
    help?: string;
    required?: boolean;
    asteriskPosition?: string;
    rules?: FieldRule<any> | FieldRule<any>[];
    labelColProps?: ObjectConstructor;
    wrapperColProps?: ObjectConstructor;
    hideLabel?: boolean;
    hideAsterisk?: boolean;
    labelColStyle?: ObjectConstructor;
    //   mergeProps?: PropType<
    //     boolean | ((props?: Record<string, any>) => Record<string, any>)
    //   >;
    labelColFlex?: string | number;
    feedback?: boolean;
    labelComponent?: string;
    labelAttrs?: ObjectConstructor;
    field: string;
    label: string;
    valueType?: string;
    attrs?: any;
    span?: number;
    slotName?: strting;
    hidden?: boolean;
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
export interface ColumnData extends TableColumnData {
    permission?: () => boolean;
}
export type ProTableProps = {
    formItems?: FormItemProps[];
    columns?: ColumnData[] | undefined;
    data?: TableData[] | undefined;
    bordered?: boolean | TableBorder | undefined;
    rowKey?: string | undefined;
    checkAll?: string | boolean;
    rowSelection?: TableRowSelection | undefined;
    expandable?: TableExpandable | undefined;
    pagination?: boolean | PaginationProps | any;
    pagePosition?: string | undefined;
    title?: string | undefined;
    listType?: string;
    request?: ((args: any) => Promise<any>) | undefined;
    scroll?: { x?: number | string; y?: number | string | bigint | any };
    selectedKeys?: BaseType[] | undefined;
};
