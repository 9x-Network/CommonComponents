import { CopyOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import copy from 'copy-to-clipboard';
import { useDesignerContext } from '../context';

const Mode = () => {
    const { value = [] } = useDesignerContext();
    const copyValue = () => {
        copy(JSON.stringify(value));
        message.success('Successfully copied to the clipboard');
    };
    return <Button type={'text'} onClick={copyValue} icon={<CopyOutlined />} />;
};

export default Mode;
