import { Form, InputNumber, Radio, Space, Switch } from 'antd';
import type { Component } from '../../interface';
import type { RowComponent } from './index';

const Property: RowComponent['Property'] = ({ component, layout = 'vertical', ...rest }) => {
    return (
        <Form layout={layout} initialValues={component} {...rest}>
            <Form.Item
                label={'Space Between'}
                name={['attrs', 'spaceBetween']}
                valuePropName={'checked'}
            >
                <Switch />
            </Form.Item>
            {!component.attrs.spaceBetween && (
                <Form.Item label={'Proportions'} name={'children'}>
                    <Proportion />
                </Form.Item>
            )}
            <Form.Item label={'Gap'} name={['attrs', 'gap']}>
                <InputNumber step={1} min={0} max={100} precision={0} />
            </Form.Item>
            <Form.Item label={'Visibility'} name={['attrs', 'visibility']}>
                <Radio.Group>
                    <Radio value={'always'}>Always</Radio>
                    <Radio value={'whenVariablesNotEmpty'}>When not contain empty</Radio>
                </Radio.Group>
            </Form.Item>
        </Form>
    );
};

interface ProportionProps {
    value?: Component[];
    onChange?: (value?: Component[]) => void;
}
function Proportion({ value, onChange }: ProportionProps) {
    const handleChange = (comp: Component, val: number | null) => {
        comp.attrs = {
            ...comp.attrs,
            weight: val === null ? undefined : val,
        };
        onChange?.(value);
    };
    return (
        <Space size={4}>
            {value?.map((comp) => (
                <InputNumber
                    key={comp.id}
                    step={1}
                    min={0}
                    max={10}
                    precision={0}
                    value={comp.attrs?.weight}
                    style={{ width: 62 }}
                    onChange={(v) => handleChange(comp, v)}
                />
            ))}
        </Space>
    );
}

export default Property;
