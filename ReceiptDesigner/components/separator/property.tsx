import { ColumnHeightOutlined, DashOutlined, LineOutlined } from '@ant-design/icons';
import { Form, Radio ,Input} from 'antd';
import { useIntl } from 'umi';
import type { SeparatorComponent } from './index';

const Property: SeparatorComponent['Property'] = ({ component, layout = 'vertical', ...rest }) => {
    const { formatMessage } = useIntl();

    return (
        <Form layout={layout} initialValues={component} {...rest}>
            <Form.Item
                label={formatMessage({ id: 'component.receiptDesigner.comp.divider.ctr.type' })}
                name={['attrs', 'appearance']}
            >
                <Radio.Group>
                    <Radio.Button value={'blank-line'}>
                        <ColumnHeightOutlined />
                    </Radio.Button>
                    <Radio.Button value={'solid-line'}>
                        <LineOutlined />
                    </Radio.Button>
                    <Radio.Button value={'dotted-line'}>
                        <DashOutlined />
                    </Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item
                label={formatMessage({ id: 'component.receiptDesigner.comp.divider.ctr.size' })}
                name={['attrs', 'size']}
            >
                <Radio.Group>
                    <Radio.Button value={'s'}>S</Radio.Button>
                    <Radio.Button value={'m'}>M</Radio.Button>
                    <Radio.Button value={'l'}>L</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item label={'Visibility'} name={['attrs', 'visibility']}>
               <Input placeholder={'input judgment condition'} />
            </Form.Item>
        </Form>
    );
};

export default Property;
