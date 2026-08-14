import MoneyFormatter from '@/components/Formatter/MoneyFormatter';
import { CardNetworkSelect } from '@/components/UniversalDataSelect';
import { ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { getIntl, useIntl } from '@umijs/max';
import type { InputNumberProps, InputProps } from 'antd';
import { Button, Input, InputNumber, Popover, Select, Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/lib/table';
import classnames from 'classnames';
import type { RuleObject } from 'rc-field-form/lib/interface';
import type { CSSProperties, PropsWithChildren } from 'react';
import React, { useMemo } from 'react';
import useStyles from './index.style';

export type FeeItem = {
    description?: string;
    fee_rate?: number;
    fee_amount?: number;
    begin_amount?: number;
    fee_min?: number;
    fee_capping?: number;
    card_type?: number;
    bankcard_network_id?: number;
    cost_fee_rate?: string;
    card_present_mode?: number;
    issuer_region?: string;
    issuer_type?: number;
    refund_fee_rate?: number;
};

export type PaymentFeeFieldProps = PropsWithChildren<{
    /**
     * 费率模式，对应后台字段fee_type
     */
    feeType: number;
    /**
     * 是否可添加行，可配置多个费率模式下生效
     */
    rowAddable?: boolean;
    /**
     * 是否可删除行，阶梯费率模式下生效
     */
    rowRemovable?: boolean;
    /**
     * 禁用项： true->全部禁用;string[]->禁用指定的字段项
     */
    disabled?: boolean | string[];
    /**
     * 只读项： true->全部只读;string[]->只读指定的字段项
     */
    readonly?: boolean | string[];
    /**
     * 是否提示额外信息： true->全部只读;string[]->只读指定的字段项
     */
    showTooltip?: string[];
    /**
     * 隐藏项： 不渲染到表单的字段
     */
    hidden?: string[];
    /**
     * 货币单位
     */
    currency?: string;
    /**
     * 同Table的onRow
     */
    onRow?: TableProps<FeeItem>['onRow'];
    /**
     * 同Table的onHeaderRow
     */
    onHeaderRow?: TableProps<FeeItem>['onHeaderRow'];
    /**
     * 自定义输入项渲染
     */
    onField?: (
        dom: React.ReactNode,
        row: FeeItem,
        ext: {
            index: number;
            value: any;
            field: string;
            path: any[];
            render: (
                props?: { value?: any; [key: string]: any },
                options?: Partial<RenderMethodExtProps>,
            ) => React.ReactNode;
            currency?: string;
            disabled?: boolean;
            readonly?: boolean;
        },
    ) => React.ReactNode;
    /**
     * 自定义title
     * @param title
     * @param currency
     */
    onTitle?: (title: string, currency?: string) => React.ReactNode;
    /**
     * 没有数据的时候默认添加一行数据
     */
    addOneByDefault?: boolean;
    className?: string;
    style?: CSSProperties;
    value?: FeeItem[];
    onChange?: (value?: FeeItem[]) => void;
    remoteDataParams?: Record<'bankcard_network_id', Record<string, any>>;
    authorizedShowFeeExtra?: boolean;
}>;

type RenderMethodExtProps = {
    currency?: string;
    readonly?: boolean;
    remoteDataParams?: PaymentFeeFieldProps['remoteDataParams'];
    field?: string;
    path: any[];
    authorizedShowFeeExtra?: boolean;
    tooltip?: React.ReactNode;
};

const FeeTypes = {
    NONE: 0,
    SINGLE_FEE_RATE: 1,
    TIERED_FEE_RATE: 2,
    SINGLE_FEE_AMOUNT: 3,
    TIERED_FEE_AMOUNT: 4,
};

const FieldMap = {
    [FeeTypes.NONE]: [],
    [FeeTypes.SINGLE_FEE_RATE]: [
        'description',
        // 'card_present_mode',
        'bankcard_network_id',
        'card_type',
        'issuer_region',
        // 'issuer_type',
        'fee_rate',
        'flat_fee',
        'fee_min',
        'fee_capping',
        'cost_fee_rate',
        'refund_fee_rate',
    ],

    [FeeTypes.TIERED_FEE_RATE]: [
        'description',
        'begin_amount',
        'card_type',
        'bankcard_network_id',
        'fee_rate',
        'flat_fee',
        'fee_min',
        'fee_capping',
        'refund_fee_rate',
    ],

    [FeeTypes.SINGLE_FEE_AMOUNT]: [
        'description',
        'card_type',
        'bankcard_network_id',
        'fee_amount',
        'flat_fee',
    ],

    [FeeTypes.TIERED_FEE_AMOUNT]: [
        'description',
        'begin_amount',
        'card_type',
        'bankcard_network_id',
        'fee_amount',
        'flat_fee',
    ],
};

const CardTypes = {
    1: getIntl().formatMessage({ id: 'components.paymentFeeField.card_type.debit' }),
    2: getIntl().formatMessage({ id: 'components.paymentFeeField.card_type.credit' }),
};
const CardPresentModes = {
    1: getIntl().formatMessage({ id: 'components.paymentFeeField.card_present_mode.physical' }),
    2: getIntl().formatMessage({ id: 'components.paymentFeeField.card_present_mode.tokenized' }),
};
const IssuerRegions = {
    1: getIntl().formatMessage({ id: 'components.paymentFeeField.issuer_region.domestic' }),
    2: getIntl().formatMessage({ id: 'components.paymentFeeField.issuer_region.foreign' }),
};
const IssuerTypes = {
    1: getIntl().formatMessage({ id: 'components.paymentFeeField.issuer_type.on' }),
    2: getIntl().formatMessage({ id: 'components.paymentFeeField.issuer_type.off' }),
};

const RenderMethods = {
    text: (props: InputProps, ext: RenderMethodExtProps) => {
        if (ext.readonly) {
            if (ext.field === 'description')
                return (
                    <>
                        {props.value?.toString()}
                        {ext.tooltip && (
                            <Popover content={ext.tooltip}>
                                <InfoCircleOutlined className={'text-muted margin-xs-left'} />
                            </Popover>
                        )}
                    </>
                    // <Row align={'middle'}>
                    //     <Ellipsis width={200}>{props.value?.toString()}</Ellipsis>
                    //     {ext.tooltip && (
                    //         <Popover content={ext.tooltip}>
                    //             <InfoCircleOutlined className={'text-muted margin-xs-left'} />
                    //         </Popover>
                    //     )}
                    // </Row>
                );
            return props.value;
        }
        return <Input {...props} />;
    },
    rate: (
        props: InputNumberProps & { extra?: string; authorizedShowFeeExtra?: boolean },
        ext: RenderMethodExtProps,
        styles: Record<string, string>,
    ) => {
        const { value, extra } = props;
        if (ext.readonly) {
            return (
                <>
                    {value}
                    {ext.authorizedShowFeeExtra && Number(value || 0) < Number(extra || 0) && (
                        <div className={styles.warning}>
                            <ExclamationCircleOutlined />
                            <span className={'margin-xxs-left'}>
                                {getIntl().formatMessage({
                                    id: 'components.paymentFeeField.title.extra',
                                })}
                            </span>
                        </div>
                    )}
                </>
            );
        }
        return (
            <div className={'nowrap'}>
                <InputNumber min={0} max={100} {...props} />
                {ext.authorizedShowFeeExtra && Number(value || 0) < Number(extra || 0) && (
                    <div className={styles.warning}>
                        <ExclamationCircleOutlined />
                        <span className={'margin-xxs-left'}>
                            {getIntl().formatMessage({
                                id: 'components.paymentFeeField.title.extra',
                            })}
                        </span>
                    </div>
                )}
            </div>
        );
    },
    amount: (props: InputNumberProps, ext: RenderMethodExtProps) => {
        const prefixProps: Partial<InputNumberProps> = {};
        let prefix = null;
        if (ext.currency) {
            prefix = MoneyFormatter.getSymbol(ext.currency);
        }
        return (
            <div className={'nowrap'}>
                {/* {prefix && <span>{prefix} </span>} */}
                {ext.readonly ? props.value : <InputNumber min={0} {...prefixProps} {...props} />}
            </div>
        );
    },
    cardType: (props: InputNumberProps, ext: RenderMethodExtProps) => {
        if (ext.readonly) {
            return CardTypes[props.value!] || '';
        }
        return (
            <Select
                value={props.value}
                onChange={props.onChange}
                disabled={props.disabled || props.readOnly}
                style={{ width: 100 }}
                allowClear
            >
                {Object.keys(CardTypes).map((key) => (
                    <Select.Option value={+key} key={key}>
                        {CardTypes[key]}
                    </Select.Option>
                ))}
            </Select>
        );
    },
    cardSwitch: (
        props: Record<string, any>,
        ext: RenderMethodExtProps,
        styles: Record<string, string>,
    ) => {
        const readonly = props.readOnly || ext.readonly;
        return (
            <div className={classnames({ [styles.readonlyMask]: readonly })}>
                <CardNetworkSelect
                    style={{ minWidth: 100 }}
                    {...props}
                    params={ext.remoteDataParams?.bankcard_network_id}
                    disabled={props.disabled}
                    allowClear
                />
            </div>
        );
    },
    cardPresentMode: (props: InputNumberProps, ext: RenderMethodExtProps) => {
        if (ext.readonly) {
            return CardPresentModes[props.value!] || '';
        }
        return (
            <Select
                value={props.value}
                onChange={props.onChange}
                disabled={props.disabled || props.readOnly}
                style={{ minWidth: 100 }}
                allowClear
            >
                {Object.keys(CardPresentModes).map((key) => (
                    <Select.Option value={+key} key={key}>
                        {CardPresentModes[key]}
                    </Select.Option>
                ))}
            </Select>
        );
    },
    issuerRegion: (props: InputNumberProps, ext: RenderMethodExtProps) => {
        if (ext.readonly) {
            return IssuerRegions[props.value!] || '';
        }
        return (
            <Select
                value={props.value}
                onChange={props.onChange}
                disabled={props.disabled || props.readOnly}
                style={{ minWidth: 100 }}
                allowClear
            >
                {Object.keys(IssuerRegions).map((key) => (
                    <Select.Option value={+key} key={key}>
                        {IssuerRegions[key]}
                    </Select.Option>
                ))}
            </Select>
        );
    },
    issuerType: (props: InputNumberProps, ext: RenderMethodExtProps) => {
        if (ext.readonly) {
            return IssuerTypes[props.value!] || '';
        }
        return (
            <Select
                value={props.value}
                onChange={props.onChange}
                disabled={props.disabled || props.readOnly}
                style={{ minWidth: 100 }}
                allowClear
            >
                {Object.keys(IssuerTypes).map((key) => (
                    <Select.Option value={+key} key={key}>
                        {IssuerTypes[key]}
                    </Select.Option>
                ))}
            </Select>
        );
    },
};

const FieldRenderMap = {
    description: RenderMethods.text,
    fee_rate: RenderMethods.rate,
    fee_min: RenderMethods.amount,
    fee_capping: RenderMethods.amount,
    fee_amount: RenderMethods.amount,
    begin_amount: RenderMethods.amount,
    flat_fee: RenderMethods.amount,
    card_type: RenderMethods.cardType,
    bankcard_network_id: RenderMethods.cardSwitch,
    cost_fee_rate: RenderMethods.text,
    card_present_mode: RenderMethods.cardPresentMode,
    issuer_region: RenderMethods.issuerRegion,
    issuer_type: RenderMethods.issuerType,
    refund_fee_rate: RenderMethods.rate,
};

const FieldTypes: any = {
    card_type: CardTypes,
    card_present_mode: CardPresentModes,
    issuer_region: IssuerRegions,
    issuer_type: IssuerTypes,
};

const FieldConfigMap = {
    description: {
        width: 260,
    },
};

const PaymentFeeField = (props: PaymentFeeFieldProps) => {
    const {
        feeType,
        value = [],
        addOneByDefault,
        rowAddable,
        rowRemovable,
        currency,
        onField,
        onChange,
        hidden,
        authorizedShowFeeExtra,
        showTooltip,
    } = props;
    const styles = useStyles();

    if (!value.length && addOneByDefault && feeType !== FeeTypes.NONE) {
        value.push({});
    }
    const isTiered = [FeeTypes.TIERED_FEE_AMOUNT, FeeTypes.TIERED_FEE_RATE].includes(feeType);
    const isSingle = [FeeTypes.SINGLE_FEE_AMOUNT, FeeTypes.SINGLE_FEE_RATE].includes(feeType);
    const { formatMessage } = useIntl();

    const fields = useMemo(() => {
        let arr = FieldMap[feeType];
        if (!arr?.length) return [];
        if (hidden) {
            arr = arr.filter((item) => !hidden.includes(item));
        }
        return arr;
    }, [feeType, hidden]);

    const onFieldChange = (evt: any, fieldName: string, index: number) => {
        const val = evt && typeof evt === 'object' ? evt.currentTarget.value : evt;
        const row = value[index];
        row[fieldName] = val;
        onChange?.([...value]);
    };
    const onFieldRemove = (index: number) => {
        value.splice(index, 1);
        onChange?.([...value]);
    };
    const renderTitle = (title: string, renderCurrency?: string) => {
        if (renderCurrency) renderCurrency = `(${renderCurrency})`;
        return formatMessage(
            { id: `components.paymentFeeField.title.${title}` },
            { currency: renderCurrency },
        );
    };
    const hasCardTypeField = fields.includes('card_type');
    const hasCardSwitchField = fields.includes('bankcard_network_id');
    // 是否可添加行
    const canAddRow = (): boolean => {
        // prop明确指定不可添加
        if (!rowAddable) return false;
        // 阶梯模式支持操作
        if (isTiered) return true;
        // 单一模式下包含卡类型或卡网络可添加
        if (isSingle) return hasCardTypeField || hasCardSwitchField;
        return false;
    };
    // 是否可删除行
    const canDelRow = (): boolean => {
        // prop明确指定不可添加
        if (!rowRemovable) return false;
        // 阶梯模式支持操作
        if (isTiered) return true;
        // 单一模式下包含卡类型或卡网络可删除
        if (isSingle) return hasCardTypeField || hasCardSwitchField;
        return false;
    };
    const renderPopover = (row: any) => {
        const list: React.ReactNode[] = [];
        showTooltip?.forEach((key) => {
            const fieldKeys = FieldTypes[key] ? FieldTypes[key][row[key]] : row[key];
            list.push(
                <div>
                    <span>
                        {formatMessage({ id: `components.paymentFeeField.title.${key}` })}：
                    </span>
                    <span>{fieldKeys || '--'}</span>
                </div>,
            );
        });
        return list;
    };
    const columns = useMemo<ColumnsType<FeeItem>>(() => {
        const cols: ColumnsType<FeeItem> = fields.map((field: string) => {
            const { onTitle = renderTitle, remoteDataParams } = props;
            return {
                ...FieldConfigMap[field],
                title: onTitle(field, currency),
                dataIndex: field,
                render: (val: any, row: FeeItem, index: number) => {
                    const render = FieldRenderMap[field];
                    if (!render) throw new Error(`Can not find render of "${field}"`);
                    let { disabled, readonly: ro } = props;
                    if (Array.isArray(disabled)) {
                        disabled = disabled.includes(field);
                    }
                    if (Array.isArray(ro)) {
                        ro = ro.includes(field);
                    }
                    const path = [index, field];
                    let input = render(
                        {
                            styles,
                            value: val,
                            onChange: (v: any) => onFieldChange(v, field, index),
                            disabled,
                            extra: row?.[`cost_${field}`],
                            // extra: row?.cost_fee_rate,
                        },
                        {
                            currency,
                            readonly: ro,
                            remoteDataParams,
                            field,
                            path,
                            authorizedShowFeeExtra,
                            tooltip:
                                showTooltip && showTooltip.length > 0 ? renderPopover(row) : null,
                        },
                        styles,
                    );
                    if (onField) {
                        input = onField(input, row, {
                            field,
                            value,
                            index,
                            currency,
                            disabled,
                            readonly: ro,
                            path,
                            render,
                        });
                    }
                    return input;
                },
            };
        });
        if (canDelRow()) {
            cols.push({
                title: formatMessage({ id: 'common.action' }),
                key: 'op',
                render: (val, row, index) => {
                    return (
                        <a className={'link-group nowrap'} onClick={() => onFieldRemove(index)}>
                            {formatMessage({ id: 'components.paymentFeeField.button.delete' })}
                        </a>
                    );
                },
            });
        }
        return cols;
    }, [feeType, value, rowRemovable, currency, fields]);
    const add = () => {
        onChange?.([...value, {}]);
    };
    const keysValue = useMemo(() => {
        if (!value) return [];
        return value.map((val, index) => ({ ...val, key: index }));
    }, [value]);
    if (!columns.length) return null;
    return (
        <div className={props.className} style={props.style}>
            <Table
                dataSource={keysValue}
                pagination={false}
                columns={columns}
                rowKey={'key'}
                onRow={props.onRow}
                onHeaderRow={props.onHeaderRow}
            />

            {canAddRow() && (
                <Button className={'margin-lg-top'} block type={'dashed'} onClick={add}>
                    {formatMessage({ id: 'components.paymentFeeField.button.addRow' })}
                </Button>
            )}
        </div>
    );
};

// function hasRepeat(arr: any[]) {
//     const hash: Record<any, any> = {};
//     // eslint-disable-next-line no-restricted-syntax
//     for (const i of arr) {
//         if (hash[arr[i]]) {
//             return true;
//         }
//         hash[arr[i]] = true;
//     }
//     return false;
// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
PaymentFeeField.validator = (feeType: number) => {
    // const { formatMessage } = getIntl();
    return (rule: RuleObject, values: FeeItem[] = []) => {
        return new Promise((resolve, reject) => {
            const errors: string[] = [];
            // const isMulti = [FeeTypes.TIERED_FEE_AMOUNT, FeeTypes.TIERED_FEE_RATE].includes(
            //     feeType,
            // );
            // // 无费率模式不验证
            // if (feeType === FeeTypes.NONE) {
            //     resolve(values);
            // }
            // // 因为编辑的时候默认放了一行但是未放到value内
            // if (feeType !== FeeTypes.NONE && !values.length) {
            //     values.push({});
            // }
            // if (values) {
            //     values.forEach((row, index) => {
            //         if (!row.description) {
            //             const msg = formatMessage(
            //                 { id: 'components.paymentFeeField.card_type.validate.required' },
            //                 { line: index + 1 },
            //             );
            //             errors.push(msg);
            //         }
            //     });
            //     if (!isMulti && values.length > 1) {
            //         const types = values.map((item) => item.card_type).filter((n) => !!n);
            //         if (hasRepeat(types)) {
            //             errors.push(
            //                 formatMessage({
            //                     id:
            //                         'components.paymentFeeField.card_type.validate.cardTypeDuplicate',
            //                 }),
            //             );
            //         }
            //     }
            // }
            if (errors.length > 0) {
                reject(errors);
            } else {
                resolve(values);
            }
        });
    };
};

PaymentFeeField.FeeTypes = FeeTypes;

export default PaymentFeeField;
