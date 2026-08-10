import type fabric from '@/components/common/QRTempDesigner/fabric';
import { PicCenterOutlined } from '@ant-design/icons';
import { Button, Menu, Popover } from 'antd';

export interface LayoutProps {
    canvas: fabric.Canvas;
    active: fabric.Object;
}

const toInt = (n?: number | string) => {
    if (n == null) return 0;
    return parseInt(n.toString(), 10);
};

const Layout = ({ active, canvas }: LayoutProps) => {
    if (!['group', 'activeSelection'].includes(active.type!)) return null;
    const alignment = (key: string) => {
        const activeObjects = active.getObjects();
        const zh = active.height! / 2;
        const zv = active.width! / 2;
        switch (key) {
            case 'ht':
                activeObjects.forEach((item) => {
                    item.set('top', 0 - zh);
                });
                canvas.renderAll();
                break;
            case 'hc':
                activeObjects.forEach((item) => {
                    item.set('top', toInt(0 - item.getScaledHeight() / 2));
                });
                canvas.renderAll();
                break;
            case 'hb':
                activeObjects.forEach((item) => {
                    item.set('top', 0);
                });
                canvas.renderAll();
                break;
            case 'vl':
                activeObjects.forEach((item) => {
                    item.set('left', 0 - zv);
                });
                canvas.renderAll();
                break;
            case 'vc':
                activeObjects.forEach((item) => {
                    item.set('left', 0 - item.getScaledWidth() / 2);
                });
                canvas.renderAll();
                break;
            case 'vr':
                activeObjects.forEach((item) => {
                    item.set('left', 0);
                });
                canvas.renderAll();
                break;
            default:
                break;
        }
    };
    return (
        <div>
            <Button.Group>
                <Popover
                    trigger={['click']}
                    content={
                        <Menu onClick={(m) => alignment(m.key)} activeKey={''}>
                            <Menu.Item key={'ht'}>Horizontal Top</Menu.Item>
                            <Menu.Item key={'hc'}>Horizontal Center</Menu.Item>
                            <Menu.Item key={'hb'}>Horizontal Bottom</Menu.Item>
                            <Menu.Item key={'vl'}>Vertical Left</Menu.Item>
                            <Menu.Item key={'vc'}>Vertical Center</Menu.Item>
                            <Menu.Item key={'vr'}>Vertical Right</Menu.Item>
                        </Menu>
                    }
                >
                    <Button title={'Alignment'} icon={<PicCenterOutlined />} />
                </Popover>
            </Button.Group>
        </div>
    );
};

export default Layout;
