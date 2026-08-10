import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Dropdown, List } from 'antd';
import type { Rule } from 'rc-field-form/lib/interface';
import { useMemo } from 'react';
import Length from './rules/length';
import Max from './rules/max';
import Min from './rules/min';
import Pattern from './rules/pattern';
import Required from './rules/required';
import Type from './rules/type';
import Whitespace from './rules/whitespace';

const validators = [Required, Pattern, Min, Max, Whitespace, Length, Type];

interface ValidatorsProps {
    value?: Rule[];
    onChange?: (value?: Rule[]) => void;
    rules?: string[];
}

const Validators = (props: ValidatorsProps) => {
    const { value, onChange, rules = [] } = props;
    const valuesWithKey = useMemo(() => {
        if (!value) return [];
        return value.map((n, index) => ({
            ...n,
            key: index,
        }));
    }, [value]);
    const handleDel = (index: number) => {
        if (!value) return;
        value.splice(index, 1);
        onChange?.([...value]);
    };

    return (
        <div>
            {valuesWithKey.length > 0 && (
                <List size={'small'} bordered>
                    {valuesWithKey.map((item, index) => {
                        const validator = validators.find((v) => v.name in item);
                        return validator ? (
                            <List.Item
                                key={item.key}
                                actions={[
                                    <Button
                                        onClick={() => handleDel(index)}
                                        key={'del'}
                                        type={'link'}
                                        icon={<DeleteOutlined />}
                                    />,
                                ]}
                            >
                                {validator.render(value!, {
                                    index: item.key,
                                    path: ['rules', item.key],
                                })}
                            </List.Item>
                        ) : null;
                    })}
                </List>
            )}
            <Dropdown
                trigger={['click']}
                menu={{
                    items: validators.map((validator) => {
                        const { multiple = false } = validator;
                        if (!rules.includes(validator.name)) return null;
                        const disabled = !multiple && value?.find((item) => validator.name in item);
                        return {
                            key: validator.name,
                            label: validator.label,
                            disabled: !!disabled,
                            onClick: () => {
                                const newVal = value ? [...value] : [];
                                newVal.push(validator.initializeData());
                                onChange?.(newVal);
                            },
                        };
                    }),
                }}
            >
                <Button type={'link'} icon={<PlusCircleOutlined />} className={'margin-sm-top'} />
            </Dropdown>
        </div>
    );
};

export default Validators;
