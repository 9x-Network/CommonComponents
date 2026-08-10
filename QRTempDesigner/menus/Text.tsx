import { FontSizeOutlined } from '@ant-design/icons';
import fabric from '../fabric';
import type { MenuProps } from './index';

const Text = (props: MenuProps) => {
    const { canvas } = props;

    const insertText = () => {
        const text = new fabric.Textbox('', {
            isWrapping: true,
            width: 300,
            left: 50,
            top: 50,
            fontSize: 22,
            fontWeight: 500,
            fill: '#1890FF',
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
    };

    return (
        <div className={'drawingpad-menu_act'} onClick={insertText}>
            <FontSizeOutlined />
        </div>
    );
};

export default Text;
