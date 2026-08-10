import { EyeOutlined } from '@ant-design/icons';
import JSONView from '@microlink/react-json-view';
import { useToggle } from 'ahooks';
import { Button, Drawer, Modal } from 'antd';
import TemplateForm from '../../index';
import { useDesignerContext } from '../context';

const Mode = () => {
    const { value } = useDesignerContext();
    const [visible, { toggle }] = useToggle();
    if (!value?.length) return null;
    const onFinish = (values?: any) => {
        Modal.info({
            title: 'Form Values',
            width: 600,
            content: (
                <JSONView
                    src={values}
                    displayDataTypes={false}
                    displayObjectSize={false}
                    enableClipboard={false}
                />
            ),
        });
        return Promise.resolve(true);
    };
    return (
        <>
            <Button onClick={toggle} type={'text'} icon={<EyeOutlined />} />
            <Drawer title={'Preview'} destroyOnClose width={600} open={visible} onClose={toggle}>
                <TemplateForm templates={value} onFinish={onFinish} />
            </Drawer>
        </>
    );
};

export default Mode;
