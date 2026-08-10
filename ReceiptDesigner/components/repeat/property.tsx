import CodeAssociateInput from '@/components/common/CodeAssociateInput';
import { Form, Input } from 'antd';
import type { RepeatComponent } from './index';

const Property: RepeatComponent['Property'] = ({ component, layout = 'vertical', ...rest }) => {
    return (
        <Form layout={layout} initialValues={component} {...rest}>
            <Form.Item label={'Data source'} name={['attrs', 'source']}>
                <CodeAssociateInput
                    rows={5}
                    placeholder={'Variable: {list} , or JSON list: [{"name":"Number.1",id:"1"}]'}
                />
            </Form.Item>
            <Form.Item label={'Item name'} name={['attrs', 'itemName']}>
                <Input placeholder={'Default: $item'} />
            </Form.Item>
            <Form.Item label={'Index name'} name={['attrs', 'indexName']}>
                <Input placeholder={'Default: $index'} />
            </Form.Item>
        </Form>
    );
};

export default Property;
