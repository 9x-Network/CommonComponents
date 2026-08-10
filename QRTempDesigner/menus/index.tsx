import { Col, Row } from 'antd';
import React from 'react';
import Brush from './Brush';
import Clear from './Clear';
import Codes from './Codes';
import Color from './Color';
import Eraser from './Eraser';
import Fill from './Fill';
import Filters from './Filters';
import FullScreen from './FullScreen';
import Image from './Image';
import PickMode from './PickMode';
import QRArea from './QRArea';
import Shape from './Shape';
import Store from './Store';
import Text from './Text';
import UnRedo from './UnRedo';

export interface MenuProps {
    canvas: fabric.Canvas;
    isDrawingMode: boolean;
    actions?: React.ReactNode[];
}

const Menus = (props: MenuProps) => {
    const { canvas, isDrawingMode } = props;

    return (
        <Row className={'drawingpad-menu'}>
            <Col flex={1}>
                <PickMode canvas={canvas} isDrawingMode={isDrawingMode} />
                <Brush canvas={canvas} isDrawingMode={isDrawingMode} />
                <Eraser canvas={canvas} isDrawingMode={isDrawingMode} />
                <Fill canvas={canvas} isDrawingMode={isDrawingMode} />
                <Shape canvas={canvas} isDrawingMode={isDrawingMode} />
                <Text canvas={canvas} isDrawingMode={isDrawingMode} />
                <Image canvas={canvas} isDrawingMode={isDrawingMode} />
                <QRArea canvas={canvas} isDrawingMode={isDrawingMode} />
                <Filters canvas={canvas} isDrawingMode={isDrawingMode} />
                <UnRedo canvas={canvas} isDrawingMode={isDrawingMode} />
                <Clear canvas={canvas} isDrawingMode={isDrawingMode} />
                <Color canvas={canvas} isDrawingMode={isDrawingMode} />
            </Col>
            <Col>
                <Codes />
                <Store canvas={canvas} isDrawingMode={isDrawingMode} />
                <FullScreen canvas={canvas} isDrawingMode={isDrawingMode} />
                {props.actions}
            </Col>
        </Row>
    );
};

export default Menus;
