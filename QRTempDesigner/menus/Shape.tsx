import { Dropdown } from 'antd';
import fabric from '../fabric';
import iconCircle from '../icons/circle.svg';
import iconDiamond from '../icons/diamond.svg';
import iconLine from '../icons/line.svg';
import icon from '../icons/shape.svg';
import iconSquare from '../icons/square.svg';
import iconTriangle from '../icons/triangle.svg';
import type { MenuProps } from './index';

const Shapes = {
    circle: {
        icon: iconCircle,
        render: (canvas: fabric.Canvas) => {
            return new fabric.Circle({
                radius: 50,
                left: 50,
                top: 50,
                fill: '#ffffff',
                stroke: canvas.freeDrawingBrush.color,
            });
        },
    },
    square: {
        icon: iconSquare,
        render: (canvas: fabric.Canvas) => {
            return new fabric.Rect({
                width: 100,
                height: 100,
                left: 50,
                top: 50,
                strokeWidth: 1,
                fill: '#ffffff',
                stroke: canvas.freeDrawingBrush.color,
            });
        },
    },
    diamond: {
        icon: iconDiamond,
        render: (canvas: fabric.Canvas) => {
            return new fabric.Rect({
                width: 100,
                height: 100,
                angle: 45,
                left: 100,
                top: 100,
                fill: '#ffffff',
                stroke: canvas.freeDrawingBrush.color,
            });
        },
    },
    triangle: {
        icon: iconTriangle,
        render: (canvas: fabric.Canvas) => {
            return new fabric.Triangle({
                top: 50,
                left: 50,
                width: 100,
                height: 100,
                fill: '#ffffff',
                stroke: canvas.freeDrawingBrush.color,
            });
        },
    },
    line: {
        icon: iconLine,
        render: (canvas: fabric.Canvas) => {
            return new fabric.Line([200, 100, 100, 100], {
                left: 50,
                top: 50,
                stroke: canvas.freeDrawingBrush.color,
            });
        },
    },
};

const Shape = (props: MenuProps) => {
    const { canvas } = props;

    const onMenu = (shape: string) => {
        const rect = Shapes[shape].render(canvas);
        canvas.add(rect);
    };

    return (
        <div id={'drawingPad-menu-shape_container'} className={'inline'}>
            <Dropdown
                trigger={['click']}
                getPopupContainer={() =>
                    document.getElementById('drawingPad-menu-shape_container')!
                }
                menu={{
                    items: Object.keys(Shapes).map((key) => ({
                        key: key,
                        icon: <img src={Shapes[key].icon} />,
                        classNames: 'drawingpad-menu_act_shape_type',
                    })),
                    onClick: ({ key }) => onMenu(key),
                }}
            >
                <div className={'drawingpad-menu_act'}>
                    <img src={icon} draggable={false} />
                </div>
            </Dropdown>
        </div>
    );
};

export default Shape;
