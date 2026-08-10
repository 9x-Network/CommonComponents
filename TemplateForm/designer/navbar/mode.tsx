import { CodeOutlined, SketchOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useDesignerContext } from '../context';

const Mode = () => {
    const { mode, setMode } = useDesignerContext();
    const changeMode = () => {
        if (mode === 'visual') setMode('source');
        else setMode('visual');
    };
    return (
        <Button
            type={'text'}
            onClick={changeMode}
            icon={mode === 'visual' ? <CodeOutlined /> : <SketchOutlined />}
        />
    );
};

export default Mode;
