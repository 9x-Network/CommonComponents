import CodeAssociateInput from '@/components/common/CodeAssociateInput';
import { AlignCenterOutlined, AlignLeftOutlined, AlignRightOutlined } from '@ant-design/icons';
import { CommonGeneralSettings, useIntl } from '@umijs/max';
import { Form, Radio } from 'antd';
import type { QRCodeComponent } from './index';

const Property: QRCodeComponent['Property'] = ({ component, layout = 'vertical', ...rest }) => {
    const { formatMessage } = useIntl();

    return (
        <Form layout={layout} initialValues={component} {...rest}>
            <Form.Item
                label={formatMessage({ id: 'component.receiptDesigner.comp.qr.ctr.align' })}
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
                label={formatMessage({ id: 'component.receiptDesigner.comp.qr.ctr.size' })}
                name={['attrs', 'size']}
            >
                <Radio.Group>
                    <Radio.Button value={'s'}>S</Radio.Button>
                    <Radio.Button value={'m'}>M</Radio.Button>
                    <Radio.Button value={'l'}>L</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item
                label={formatMessage({ id: 'component.receiptDesigner.comp.qr.ctr.content' })}
                name={'children'}
            >
                <CodeAssociateInput
                    variables={CommonGeneralSettings.receiptDesigner.autocomplete.qrcode}
                    rows={2}
                />
            </Form.Item>
        </Form>
    );
};

export default Property;
