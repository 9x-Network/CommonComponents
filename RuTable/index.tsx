import { removeEmptyProperties } from '@/utils/utils';
import type { ParamsType } from '@ant-design/pro-provider';
import type {
    ActionType,
    ColumnsState as ProColumnsState,
    ProColumns,
    ProColumnType,
    ProTableProps,
    RequestData,
} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { message } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import type { SortOrder } from 'antd/lib/table/interface';
import React, { useEffect, useImperativeHandle, useRef } from 'react';

export type RuActionType = ActionType;
export declare type RuColumns<T = any> = ProColumns<T>;
export type RuColumnType<T = unknown> = ProColumnType<T>;
export type RuColumnsState = ProColumnsState;
export type OnRequest<U> = (
    params: U & {
        pageSize?: number;
        current?: number;
        keyword?: string;
    },
    sort: Record<string, SortOrder>,
    filter: Record<string, React.ReactText[]>,
) => {
    params: U & {
        pageSize?: number;
        current?: number;
        keyword?: string;
    };
    sort: Record<string, SortOrder>;
    filter: Record<string, React.ReactText[]>;
};

type ProTableFormProp<T, U, ValueType> = ProTableProps<T, U, ValueType>['form'];
type ProTableToolbarProp<T, U, ValueType> = ProTableProps<T, U, ValueType>['toolbar'];

export interface RuTableProp<T, U extends ParamsType, ValueType = 'text'>
    extends ProTableProps<T, U, ValueType> {
    id?: string;
    onRequest?: OnRequest<U>;
    onResponse?: (data: any) => RequestData<T>;
    transferParams?: (params: U) => U;
    removeRequestParamsEmptyAttribute?: boolean;
    form?: ProTableFormProp<T, U, ValueType>;
    toolbar?: ProTableToolbarProp<T, U, ValueType>;
}

export type RuTableInstance = {
    key?: string;
    actionRef?: React.MutableRefObject<RuActionType | undefined>;
    formRef?: React.MutableRefObject<FormInstance | undefined>;
};

const tableInstanceSet: Record<string, RuTableInstance> = {};

const DefaultProps = {
    onRequest: (params: any, sort: any, filter: any) => {
        // 自定义转换请求数据，把分页字段改成和接口一致
        const newParams = {
            ...params,
            page_num: params.current,
            page_size: params.pageSize,
        };
        delete newParams.current;
        delete newParams.pageSize;
        return { params: newParams, sort, filter };
    },
    onResponse: (res: any = {}): RequestData<any> => {
        // 可以在这里自定义转换返回数据
        return {
            data: res.list,
            total: res.total,
            success: true,
            ...res,
        };
    },
    onRequestError: (err: Error) => {
        message.error(err.message, 5);
    },
    removeRequestParamsEmptyAttribute: true,
};

/**
 * 高级 Table表格，基于ProTable包装
 * @param props
 * @constructor
 */
const RuTable = <
    T extends Record<string, any>,
    U extends ParamsType = ParamsType,
    ValueType = 'text',
>(
    props: RuTableProp<T, U, ValueType>,
) => {
    const {
        actionRef: propsActionRef,
        formRef: propsFormRef,
        request,
        onRequest = DefaultProps.onRequest,
        onResponse = DefaultProps.onResponse,
        transferParams,
        removeRequestParamsEmptyAttribute = DefaultProps.removeRequestParamsEmptyAttribute,
        id,
        form,
        toolbar,
        onRequestError = DefaultProps.onRequestError,
        search,
        pagination,
        ...rest
    } = props;
    const actionRef = useRef<RuActionType>();
    const formRef = useRef<FormInstance>();
    // 绑定 action ref、form ref
    useImperativeHandle(propsActionRef, () => actionRef.current, [actionRef.current]);
    useImperativeHandle(propsFormRef, () => formRef.current, [formRef.current]);
    useEffect(() => {
        if (typeof propsActionRef === 'function' && actionRef.current) {
            propsActionRef(actionRef.current);
        }
        if (typeof propsFormRef === 'function' && formRef.current) {
            // @ts-ignore
            propsFormRef(formRef.current);
        }
    }, [actionRef.current, formRef.current]);
    useEffect(() => {
        if (props.id && tableInstanceSet[props.id]) {
            throw new Error(`The table "${props.id}" already exist`);
        }
        if (props.id) {
            tableInstanceSet[props.id] = {
                actionRef,
                formRef,
            };
        }
        return () => {
            if (props.id) {
                delete tableInstanceSet[props.id];
            }
        };
    }, []);
    const wrapRequest = request
        ? (params: any, sort: any, filter: any) => {
              if (removeRequestParamsEmptyAttribute) {
                  params = removeEmptyProperties(params);
              }
              if (onRequest) {
                  const ret = onRequest(params, sort, filter);
                  params = ret.params;
                  sort = ret.sort;
                  filter = ret.filter;
              }
              if (transferParams) {
                  params = transferParams(params);
              }
              return request(params, sort, filter).then((res) => {
                  return onResponse ? onResponse(res) : res;
              });
          }
        : undefined;

    return (
        <ProTable<T, U, ValueType>
            actionRef={actionRef}
            formRef={formRef}
            request={wrapRequest}
            id={id && `rutable_${id}`}
            search={
                search === false
                    ? false
                    : {
                          layout: 'vertical',
                          defaultColsNumber: 12,
                          ...search,
                      }
            }
            form={form}
            toolbar={{
                settings: [],
                ...toolbar,
            }}
            // toolbar={toolbar}
            onRequestError={onRequestError}
            pagination={{
                totalBoundaryShowSizeChanger: 0,
                ...pagination,
            }}
            {...rest}
        />
    );
};

/**
 * 获取Table实列
 * @param id Table的id
 */
RuTable.getTable = (id: string): RuTableInstance => {
    return { ...tableInstanceSet[id], key: id };
};
/**
 * 获取一组Table实列
 * @param id Table的id数组
 */
RuTable.getTables = (id?: string[]): RuTableInstance[] => {
    const tables: RuTableInstance[] = [];
    Object.keys(tableInstanceSet).forEach((key) => {
        if (id && id.length) {
            if (id.indexOf(key) !== -1) {
                tables.push({
                    key,
                    ...tableInstanceSet[key],
                });
            }
        } else {
            tables.push({
                key,
                ...tableInstanceSet[key],
            });
        }
    });
    return tables;
};

export default RuTable;
