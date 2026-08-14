import { AlignCenterOutlined, AlignLeftOutlined, AlignRightOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Form, Radio } from 'antd';
import debounce from 'lodash/debounce';
import type { ImageComponent } from './index';
import Upload from './upload';

const Property: ImageComponent['Property'] = ({
    component,
    onValuesChange,
    form: _form,
    layout = 'vertical',
    omitFields,
    ...rest
}) => {
    const [form] = Form.useForm(_form);
    const { formatMessage } = useIntl();

    const updateValue = (changedValues: any) => {
        onValuesChange?.(changedValues);
    };
    // 延时更新
    const updateValueDebounce = debounce(updateValue, 300);

    const handleValuesChange = (changedValue: any) => {
        if ('children' in changedValue) {
            updateValueDebounce(changedValue);
        } else {
            updateValue(changedValue);
        }
    };

    return (
        <Form
            layout={layout}
            form={form}
            onValuesChange={handleValuesChange}
            initialValues={component}
            {...rest}
        >
            <Form.Item
                label={formatMessage({ id: 'component.receiptDesigner.comp.img.ctr.align' })}
                name={['attrs', 'align']}
            >
                <Radio.Group>
                    <Radio.Button value={'start'}>
                        <AlignLeftOutlined />
                    </Radio.Button>
                    <Radio.Button value={'center'}>
                        <AlignCenterOutlined />
                    </Radio.Button>
                    <Radio.Button value={'end'}>
                        <AlignRightOutlined />
                    </Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item
                label={formatMessage({ id: 'component.receiptDesigner.comp.img.ctr.source' })}
                name={'children'}
            >
                <Upload />
            </Form.Item>
        </Form>
    );
};

export default Property;
