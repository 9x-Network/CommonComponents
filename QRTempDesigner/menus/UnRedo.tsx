import iconRedo from '../icons/redo.svg';
import iconUndo from '../icons/undo.svg';
import type { MenuProps } from './index';

const OnRedo = (props: MenuProps) => {
    const { canvas } = props;
    function undo() {
        canvas.undo();
    }
    function redo() {
        canvas.redo();
    }

    return (
        <>
            <div className={'drawingpad-menu_act'} onClick={undo}>
                <img src={iconUndo} draggable={false} />
            </div>
            <div className={'drawingpad-menu_act'} onClick={redo}>
                <img src={iconRedo} draggable={false} />
            </div>
        </>
    );
};

export default OnRedo;
