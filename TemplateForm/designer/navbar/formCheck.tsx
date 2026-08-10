import { ClearOutlined, IssuesCloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useDesignerContext } from '../context';

const FormCheck = () => {
    const { mode, value, workForm } = useDesignerContext();
    if (mode !== 'visual' || !value?.length) return null;
    return (
        <>
            <Button
                onClick={() => {
                    workForm.resetFields();
                }}
                type={'text'}
                icon={<ClearOutlined />}
            />
            <Button
                onClick={() => {
                    workForm.validateFields();
                }}
                type={'text'}
                icon={<IssuesCloseOutlined />}
            />
        </>
    );
};

export default FormCheck;
