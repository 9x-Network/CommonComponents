import CodeAssociateInput from '@/components/common/CodeAssociateInput';
import { toBoolean } from '@/utils/utils';
import { AlignCenterOutlined, AlignLeftOutlined, AlignRightOutlined } from '@ant-design/icons';
import { Checkbox, Form, Radio } from 'antd';
import { useMemo } from 'react';
import { CommonGeneralSettings, useIntl } from '@umijs/max';
import type { TextComponent } from './index';

const Property: TextComponent['Property'] = ({
    component,
    layout = 'vertical',
    onValuesChange,
    ...rest
}) => {
    const { formatMessage } = useIntl();

    const initialValues = useMemo(() => {
        const values: any = { children: component.children, attrs: component.attrs, style: [] };
        if (toBoolean(values.attrs.bold)) {
            values.style.push('bold');
        }
        if (toBoolean(values.attrs.italic)) {
            values.style.push('italic');
        }
        return values;
    }, [component]);
    const handleValuesChange = (changed: any, values: any) => {
        if (changed.style) {
            changed.attrs = {
                ...changed.attrs,
                bold: values.style?.includes('bold'),
                italic: values.style?.includes('italic'),
            };
            values.attrs = {
                ...values.attrs,
                bold: values.style?.includes('bold'),
                italic: values.style?.includes('italic'),
            };
        }
        onValuesChange?.(changed, values);
    };

    return (
        <Form
            layout={layout}
            initialValues={initialValues}
            onValuesChange={handleValuesChange}
            {...rest}
        >
            <Form.Item
                label={formatMessage({ id: 'component.receiptDesigner.comp.img.ctr.align' })}
                name={['attrs', 'align']}
            >
                <Radio.Group>
                    <Radio.Button value={'left'}>
                        <AlignLeftOutlined />
                    </Radio.Button>
                    <Radio.Button value={'center'}>
                        <AlignCenterOutlined />
                    </Radio.Button>
                    <Radio.Button value={'right'}>
                        <AlignRightOutlined />
                    </Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item label={'Content'} name={'children'}>
                <CodeAssociateInput
                    rows={2}
                    variables={CommonGeneralSettings.receiptDesigner.autocomplete.text}
                    placeholder={formatMessage({
                        id: 'component.receiptDesigner.comp.text.ctr.content.ph',
                    })}
                    mappable
                    mappings={component.attrs?.mappings}
                    onMappingsChange={(mappings) =>
                        onValuesChange?.(
                            { attrs: { mappings } },
                            {
                                children: component.children,
                                attrs: { ...component.attrs, mappings },
                            },
                        )
                    }
                />
            </Form.Item>
            <Form.Item
                name={['attrs', 'size']}
                label={formatMessage({ id: 'component.receiptDesigner.comp.text.ctr.fsi' })}
            >
                <Radio.Group>
                    <Radio.Button value={'s'}>S</Radio.Button>
                    <Radio.Button value={'m'}>M</Radio.Button>
                    <Radio.Button value={'l'}>L</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item label={'Visibility'} name={['attrs', 'visibility']}>
                <Radio.Group>
                    <Radio value={'always'}>Always</Radio>
                    <Radio value={'whenVariablesNotEmpty'}>When not contain empty</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label={'Style'} name={'style'}>
                <Checkbox.Group
                    options={[
                        { label: 'Bold', value: 'bold' },
                        { label: 'Italic', value: 'italic' },
                    ]}
                />
            </Form.Item>
        </Form>
    );
};

export default Property;
