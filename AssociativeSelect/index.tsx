import { useDiffChange } from '@/utils/hooks/diffChange';
import uRequest from '@/utils/request';
import { LoadingOutlined } from '@ant-design/icons';
import { Alert, Select } from 'antd';
import type { SelectProps, SelectValue } from 'antd/lib/select';
import type { UIEvent } from 'react';
import React, { useCallback, useState } from 'react';
import { useIntl,useRequest } from 'umi';

export type AssociativeSelectData<DT> = {
    total: number;
    data: DT[];
    page_num: number;
    page_size: number;
};

export type AssociativeSelectProps<VT, DT> = {
    /**
     * label显示的字段名
     */
    labelKey?: string;
    /**
     * value数据的字段名
     */
    valueKey?: string;
    /**
     * 返回数据列表字段名
     */
    responseListKey?: string;
    /**
     * 自定义 label 渲染
     * @param item
     * @param page
     */
    labelRender?: (item: DT, page: AssociativeSelectData<DT>) => React.ReactNode;
    /**
     * 自定义value
     * @param item
     * @param page
     */
    valueRender?: (item: DT, page: AssociativeSelectData<DT>) => any;
    /**
     * 自定义单项渲染
     * @param item
     * @param page
     */
    itemRender?: (
        item: DT,
        dom: React.ReactNode,
        page: AssociativeSelectData<DT>,
    ) => React.ReactNode;
    /**
     * 单个项的key
     * @param item
     */
    itemKey?: ((item: DT) => string) | string;
    /**
     * 联想搜索时关键词的键
     */
    searchKey?: string;
    /**
     * 数据源获取
     * @param params
     */
    request: ((params?: AnyObject) => Promise<any>) | string;
    /**
     * 请求携带的参数，变化后会自动重新加载获取
     */
    params?: AnyObject;
    /**
     * 每页数量
     */
    pageSize?: number;
    /**
     * 当滑动到滚动条底部触发
     * @param evt
     * @param page
     */
    onScrollBottom?: (evt: UIEvent<HTMLDivElement>, page: AssociativeSelectData<DT>) => void;
    /**
     * 当数据加载完成后回调
     */
    onLoad?: (page: AssociativeSelectData<DT>, params?: any) => void;
    /**
     * 当加载错误时回调
     */
    onError?: (err: Error) => void;
} & Omit<SelectProps<VT>, 'onSearch' | 'searchValue'>;

/**
 * 联想搜索+滚动分页下拉选择器
 * @param props
 * @constructor
 */
const AssociativeSelect = <VT extends SelectValue = any, DT extends object = any>(
    props: AssociativeSelectProps<VT, DT>,
) => {
    const {
        params,
        request,
        loading,
        pageSize = 20,
        labelKey = 'label',
        valueKey = 'value',
        responseListKey = 'list',
        itemKey = valueKey,
        searchKey = labelKey,
        labelRender,
        valueRender,
        itemRender,
        virtual = true,
        filterOption = false,
        showSearch = true,
        onScrollBottom,
        onLoad,
        onError,
        onClear,
        notFoundContent,
        placeholder,
        ...rest
    } = props;
    const defaultPage = {
        total: 0,
        data: [],
        page_num: 1,
        page_size: pageSize,
    };
    const { formatMessage } = useIntl();
    const [page, setPage] = useState<AssociativeSelectData<DT>>(defaultPage);
    const [searchValue, setSearchValue] = useState<string>();

    const requestData = useCallback(
        (arg: any, resetData?: boolean) => {
            if (resetData) setPage(defaultPage);
            const req =
                typeof request === 'function' ? request : (d: any) => uRequest.post(request, d);
            return req({
                page_num: page.page_num,
                page_size: pageSize,
                ...arg,
            });
        },
        [defaultPage, page.page_num, pageSize, request],
    );

    const {
        run: fetch,
        loading: fetching,
        error,
    } = useRequest(requestData, {
        manual: true,
        debounceInterval: 500,
        formatResult: (res) => res,
        onSuccess: (res, p) => {
            const list = !responseListKey ? res : res[responseListKey];
            const [pageInfo] = p;
            const newPage = {
                ...page,
                total: res.total,
                data: [...page.data, ...(list || [])],
            };
            if (pageInfo) {
                if (pageInfo.page_num) newPage.page_num = pageInfo.page_num;
                if (pageInfo.page_size) newPage.page_size = pageInfo.page_size;
            }
            setPage(newPage);
            onLoad?.(newPage, p);
        },
        onError,
    });

    useDiffChange(() => {
        fetch(params, true);
    }, [params]);

    const busy = fetching || loading;

    const getLabel = (item: DT) => {
        if (labelRender) {
            return labelRender(item, page);
        }
        return item[labelKey];
    };
    const getValue = (item: DT) => {
        if (valueRender) {
            return valueRender(item, page);
        }
        return item[valueKey];
    };
    const getKey = (item: DT) => {
        if (typeof itemKey === 'function') {
            return itemKey(item);
        }
        return item[itemKey];
    };
    const getTitle = (item: DT) => {
        return item[labelKey];
    };   

    const onSearch = (val: string) => {
        setSearchValue(val);
        fetch(
            {
                ...params,
                [searchKey]: val?.trim() || undefined,
            },
            true,
        );
    };
    const onPopupScroll = (evt: UIEvent<HTMLDivElement>) => {
        const { currentTarget } = evt;
        const container = currentTarget.children[0] as HTMLDivElement;
        let isBottom: boolean = false;
        if (virtual) {
            const scroller = container.children[0] as HTMLDivElement;
            const tx = scroller.style.transform.match(/translateY\(\d+px\)/);
            let { scrollTop } = container;
            if (tx?.length) {
                const number = tx[0]?.match(/\d+/);
                if (number) scrollTop = +number[0];
            }
            isBottom = scrollTop + scroller.scrollHeight === container.clientHeight;
        } else {
            isBottom =
                currentTarget.scrollHeight === currentTarget.scrollTop + currentTarget.clientHeight;
        }
        if (isBottom && !busy) {
            if (onScrollBottom) onScrollBottom(evt, page);
            if (Math.ceil(page.total / page.page_size) > page.page_num) {
                fetch({
                    ...params,
                    page_num: page.page_num + 1,
                    [searchKey]: searchValue || undefined,
                });
            }
        }
    };
    const handleClear = () => {
        if (showSearch) {
            onSearch('');
        }
        onClear?.();
    };
    if (error) {
        return <Alert message={error.message} showIcon type={'error'} />;
    }
    return (
        <Select<VT>
            loading={busy}
            onPopupScroll={onPopupScroll}
            virtual={virtual}
            notFoundContent={
                busy ? (
                    <div className={'text-center'}>
                        <LoadingOutlined />
                    </div>
                ) : (
                    notFoundContent
                )
            }
            filterOption={showSearch ? filterOption : undefined}
            searchValue={searchValue}
            onSearch={showSearch ? onSearch : undefined}
            onClear={handleClear}
            showSearch={showSearch}
            placeholder={placeholder || formatMessage({ id: 'common.pleaseSelect' })}
            {...rest}
        >
            {page.data.map((item) => {
                const dom = (
                    <Select.Option key={getKey(item)} value={getValue(item)}  title={getTitle(item)} sourcedata={item}>
                        {getLabel(item)}
                    </Select.Option>
                );
                return itemRender ? itemRender(item, dom, page) : dom;
            })}
            {busy && (
                <Select.Option disabled value={''}>
                    <LoadingOutlined />
                </Select.Option>
            )}
        </Select>
    );
};

export default AssociativeSelect;
