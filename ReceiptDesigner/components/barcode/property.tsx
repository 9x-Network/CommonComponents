import CodeAssociateInput from '@/components/common/CodeAssociateInput';
import { AlignCenterOutlined, AlignLeftOutlined, AlignRightOutlined } from '@ant-design/icons';
import { Form, Radio } from 'antd';
import { CommonGeneralSettings, useIntl } from '@umijs/max';
import type { BarCodeComponent } from './index';

const Property: BarCodeComponent['Property'] = ({ component, layout = 'vertical', ...rest }) => {
    const { formatMessage } = useIntl();

    return (
        <Form initialValues={component} {...rest} layout={layout}>
            <Form.Item
                label={formatMessage({ id: 'component.receiptDesigner.comp.bar.ctr.align' })}
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
                label={formatMessage({ id: 'component.receiptDesigner.comp.bar.ctr.size' })}
                name={['attrs', 'size']}
            >
                <Radio.Group>
                    <Radio.Button value={'s'}>S</Radio.Button>
                    <Radio.Button value={'m'}>M</Radio.Button>
                    <Radio.Button value={'l'}>L</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item
                label={formatMessage({ id: 'component.receiptDesigner.comp.bar.ctr.content' })}
                name={'children'}
            >
                <CodeAssociateInput
                    variables={CommonGeneralSettings.receiptDesigner.autocomplete.barcode}
                    rows={1}
                />
            </Form.Item>
        </Form>
    );
};

export default Property;
