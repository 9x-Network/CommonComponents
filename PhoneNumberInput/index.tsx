import { getCountries } from '@/services/basis';
import { getIntl, useRequest, useStore } from '@umijs/max';
import { useControllableValue } from 'ahooks';
import type { InputProps, InputRef, RefSelectProps } from 'antd';
import { Empty, Input, Select, Space, Spin } from 'antd';
import type { RuleObject } from 'antd/lib/form';
import type { PropsWithChildren } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import useStyles from './style.style';

export interface PhoneNumberInputProps extends Omit<InputProps, 'addonBefore' | 'onChange'> {
    /**
     * 区号与手机号之间的分隔符
     */
    splitter?: string;
    value?: string;
    onChange?: (value?: string) => void;
    defaultAreaCode?: string;
    areaCode?: string;
    onAreaCodeChange?: (areaCode?: string) => void;
}

let CacheList: any = [];

const PhoneNumberInput = (props: PropsWithChildren<PhoneNumberInputProps>) => {
    const { styles } = useStyles();
    const {
        splitter = ' ',
        prefix,
        defaultAreaCode = '',
        disabled,
        readOnly,
        maxLength = 20,
        areaCode,
        onAreaCodeChange,
        ...rest
    } = props;
    const { settings } = useStore<any>().getState();
    const [value, setValue] = useControllableValue<string | undefined>(props);
    const [code, setCode] = useControllableValue<string | undefined>(props, {
        valuePropName: 'areaCode',
        defaultValuePropName: 'defaultAreaCode',
        defaultValue: defaultAreaCode || settings?.custom?.telephone_code || '',
        trigger: 'onAreaCodeChange',
    });
    const [number, setNumber] = useState<string>('');

    const [open, setOpen] = useState<boolean>(false);
    const inputRef = useRef<InputRef>(null);
    const selectRef = useRef<RefSelectProps>(null);

    const { data, loading } = useRequest(() => getCountries({ page_size: 999 }), {
        onSuccess: (res: any) => {
            CacheList = res;
        },
        formatResult: (res) => {
            const sourceList: any[] = res.list;
            const resultList: any[] = [];
            const repeatMap: Record<string, any[]> = {};
            sourceList.forEach((item) => {
                if (!item.telephone_code) return;
                if (repeatMap[item.telephone_code]) {
                    repeatMap[item.telephone_code].push(item);
                } else {
                    repeatMap[item.telephone_code] = [item];
                }
            });
            Object.keys(repeatMap).forEach((key) => {
                resultList.push({
                    value: key,
                    label: repeatMap[key].map((item) => item.country_name).join(','),
                });
            });
            return resultList.sort((a, b) => (a.value.length > b.value.length ? 1 : -1));
        },
        initialData: CacheList,
    });

    useEffect(() => {
        if (value) {
            const [c, n] = value.split(splitter);
            if (c) {
                setCode(c);
                if (n) {
                    setNumber(n);
                } else {
                    setValue('');
                }
            } else {
                console.error('Invalid phone number format:', value);
                setNumber('');
            }
        } else {
            setNumber('');
        }
    }, [value, splitter, defaultAreaCode]);

    const emitChange = useCallback(
        (code?: string, num?: string) => {
            num = num ? num.replace(/\D/g, '') : '';
            if (num) {
                const val = [code, num].filter((n) => !!n).join(splitter);
                setValue(val);
            } else {
                setValue('');
            }
        },
        [splitter, setValue],
    );

    const onCodeChange = useCallback(
        (val: string) => {
            setCode(val);
            if (number) {
                emitChange(val, number);
            } else {
                inputRef.current?.focus();
            }
        },
        [emitChange, number],
    );

    const onNumberChange = useCallback(
        (val: string) => {
            emitChange(code, val);
        },
        [code, emitChange],
    );

    return (
        <Space.Compact className={styles.input} style={{ width: '100%' }}>
            {prefix}
            <Select
                disabled={disabled || readOnly}
                className={styles.select}
                popupMatchSelectWidth={false}
                loading={loading}
                classNames={{ popup: { root: styles.dropdown } }}
                open={open}
                onOpenChange={setOpen}
                value={code}
                onChange={onCodeChange}
                showSearch
                allowClear={false}
                onKeyDown={(evt) => {
                    if (evt.key === ' ') {
                        evt.preventDefault();
                    }
                }}
                onClear={() => {
                    setTimeout(() => {
                        selectRef.current?.focus();
                    }, 100);
                }}
                filterOption={(input, option) => {
                    if (!option) return true;
                    const item: any = option['data-item'];
                    const text = input.toLowerCase().replace(/^\+/g, '');
                    return (
                        item.value.startsWith(text) || item.label.toLowerCase().indexOf(text) >= 0
                    );
                }}
                notFoundContent={loading ? <Spin /> : <Empty />}
                ref={selectRef}
                aria-autocomplete={'none'}
            >
                {data?.map((item: any) => (
                    <Select.Option key={item.value} value={item.value} data-item={item}>
                        <div className={'item'}>
                            <div className={'code'}>+{item.value}</div>
                            <div className={'country'}>{item.label}</div>
                        </div>
                    </Select.Option>
                ))}
            </Select>
            <Input
                autoComplete={'none'}
                onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !inputRef.current!.input?.value) {
                        onCodeChange('');
                        selectRef.current?.focus();
                        setOpen(true);
                    }
                }}
                onKeyPress={(e) => {
                    if (!code) {
                        e.preventDefault();
                        selectRef.current?.focus();
                        setOpen(true);
                    }
                    // if (!/^[0-9]$/.test(e.key)) {
                    //     e.preventDefault();
                    // }
                }}
                disabled={loading || disabled}
                readOnly={readOnly}
                ref={inputRef}
                onClick={() => {
                    if (!code) {
                        selectRef.current?.focus();
                        setOpen(true);
                    }
                }}
                maxLength={maxLength}
                {...rest}
                value={number}
                onChange={(event) => onNumberChange(event.target.value)}
            />
        </Space.Compact>
    );
};

PhoneNumberInput.validator = {
    integrality: (rule: RuleObject, value: string) => {
        const { formatMessage } = getIntl();
        return new Promise((resolve, reject) => {
            if (!value) {
                resolve(value);
                return;
            }
            if (!/\d+\s\d{3}/.test(value)) {
                reject(
                    new Error(
                        formatMessage({ id: 'components.phoneNumberInput.validate.integrality' }),
                    ),
                );
            }
            resolve(value);
        });
    },
};

export default PhoneNumberInput;
