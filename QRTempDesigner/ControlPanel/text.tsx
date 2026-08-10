import {
    AlignCenterOutlined,
    AlignLeftOutlined,
    AlignRightOutlined,
    BoldOutlined,
    ItalicOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import { Button, InputNumber, Radio, Select } from 'antd';
import fabric from '../fabric';

export interface TextProps {
    canvas: fabric.Canvas;
    active: fabric.Object;
}

// const fonts: string[] = `auto,Helvetica Neue,Lucida Grande,Lucida Sans,Lucida Sans Unicode,sans-serif,cursive,fantasy`.split(
//     ',',
// );

const fonts: string[] = [];

const Text = ({ active, canvas }: TextProps) => {
    const isMulti = ['group', 'activeSelection'].includes(active.type || '');

    const setFontStyle = (fontStyle: 'normal' | 'italic' | 'bold') => {
        const text = active as fabric.Textbox;
        const style: Record<string, any> = {};
        if (fontStyle === 'bold') {
            style.fontWeight = 800;
        } else {
            style.fontStyle = fontStyle;
            if (fontStyle === 'normal') {
                style.fontWeight = 500;
            }
        }
        if (text.isEditing) {
            text.setSelectionStyles(style);
        } else {
            text.set(style);
        }
        canvas.renderAll();
    };

    const setFontAlign = (align: string) => {
        (active as fabric.Textbox)!.set('textAlign', align);
        canvas.renderAll();
    };

    if (!(active instanceof fabric.Text) || isMulti) return null;
    return (
        <>
            <div>
                <label>Font Color</label>
                <input
                    type={'color'}
                    className={'drawingpad-controller_colorpicker'}
                    onChange={(evt) => {
                        const color = evt.currentTarget.value;
                        if (active.isEditing) {
                            active.setSelectionStyles({
                                fill: color,
                            });
                        } else {
                            active.set({ fill: color });
                        }
                        canvas.renderAll();
                    }}
                />
            </div>
            <div>
                <label>Font Family</label>
                <Select
                    style={{ width: 200 }}
                    onChange={(fontFamily: string) => {
                        if (active.isEditing) {
                            active.setSelectionStyles({
                                fontFamily,
                            });
                        } else {
                            active.set('fontFamily', fontFamily);
                        }

                        canvas.renderAll();
                    }}
                >
                    {fonts.map((item) => (
                        <Select.Option key={item} value={item}>
                            {item}
                        </Select.Option>
                    ))}
                </Select>
            </div>
            <div>
                <label>Font Size</label>
                <InputNumber
                    defaultValue={active.get('fontSize')}
                    min={12}
                    max={1000}
                    onChange={(fontSize) => {
                        if (active.isEditing) {
                            active.setSelectionStyles({
                                fontSize,
                            });
                        } else {
                            active.set({ fontSize: fontSize! });
                        }
                        canvas.renderAll();
                    }}
                />
            </div>
            <div>
                <Radio.Group value={''}>
                    <Radio.Button
                        onClick={() => {
                            setFontAlign('left');
                        }}
                    >
                        <AlignLeftOutlined />
                    </Radio.Button>
                    <Radio.Button
                        onClick={() => {
                            setFontAlign('center');
                        }}
                    >
                        <AlignCenterOutlined />
                    </Radio.Button>
                    <Radio.Button
                        onClick={() => {
                            setFontAlign('right');
                        }}
                    >
                        <AlignRightOutlined />
                    </Radio.Button>
                </Radio.Group>
            </div>
            <div>
                <Button.Group>
                    <Button
                        icon={<BoldOutlined />}
                        title={'Bold'}
                        onClick={() => setFontStyle('bold')}
                    />
                    <Button
                        icon={<ItalicOutlined />}
                        title={'Italic'}
                        onClick={() => setFontStyle('italic')}
                    />
                    <Button
                        icon={<ReloadOutlined />}
                        title={'Normal'}
                        onClick={() => setFontStyle('normal')}
                    />
                </Button.Group>
            </div>
        </>
    );
};

export default Text;
