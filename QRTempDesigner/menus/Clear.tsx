import { ClearOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import type { MenuProps } from './index';

const Clear = ({ canvas }: MenuProps) => {
    const clear = () => {
        Modal.confirm({
            title: 'Are you sure to clear all objects?',
            onOk: () => {
                canvas.clear();
            },
        });
    };
    return (
        <div className={'drawingpad-menu_act'} onClick={clear}>
            <ClearOutlined />
        </div>
    );
};

export default Clear;
