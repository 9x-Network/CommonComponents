import { useForceUpdate } from '@/utils/hooks/forceUpdate';
import { FunctionOutlined } from '@ant-design/icons';
import ProForm, { ProFormCheckbox, ProFormSlider } from '@ant-design/pro-form';
import { Dropdown, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import fabric from '../fabric';

export interface FiltersProps {
    canvas: fabric.Canvas;
    isDrawingMode: boolean;
}

const ColorFilters = {
    Invert: {
        label: 'Invert',
        FilterClass: fabric.Image.filters.Invert,
    },
    Sepia: {
        label: 'Sepia',
        FilterClass: fabric.Image.filters.Sepia,
    },
    BlackWhite: {
        label: 'Black/White',
        FilterClass: fabric.Image.filters.BlackWhite,
    },
    Brownie: {
        label: 'Brownie',
        FilterClass: fabric.Image.filters.Brownie,
    },
    Vintage: {
        label: 'Vintage',
        FilterClass: fabric.Image.filters.Vintage,
    },
    Kodachrome: {
        label: 'Kodachrome',
        FilterClass: fabric.Image.filters.Kodachrome,
    },
    Technicolor: {
        label: 'Technicolor',
        FilterClass: fabric.Image.filters.Technicolor,
    },
    Polaroid: {
        label: 'Polaroid',
        FilterClass: fabric.Image.filters.Polaroid,
    },
    RemoveColor: {
        label: 'Remove Color',
        FilterClass: fabric.Image.filters.RemoveColor,
        args: { color: '#000' },
    },
    RemoveColor_Color: {
        label: 'Color',
        type: 'color',
        vender: 'RemoveColor',
        property: 'color',
    },
    RemoveColor_Distance: {
        label: 'Distance',
        type: 'slider',
        vender: 'RemoveColor',
        property: 'distance',
        valueTransform: (val: number) => val / 100,
    },
    Gamma: {
        label: 'Gamma',
        FilterClass: fabric.Image.filters.Gamma,
    },
    Gamma_Red: {
        label: 'Red',
        type: 'slider',
        vender: 'Gamma',
        property: (filter: any, val: any) => {
            filter.gamma[0] = val;
        },
    },
    Gamma_Green: {
        label: 'Green',
        type: 'slider',
        vender: 'Gamma',
        property: (filter: any, val: any) => {
            filter.gamma[1] = val;
        },
    },
    Gamma_Blue: {
        label: 'Blue',
        type: 'slider',
        vender: 'Gamma',
        property: (filter: any, val: any) => {
            filter.gamma[2] = val;
        },
    },
};
const StylizationFilters = {
    Contrast: {
        label: 'Contrast',
        FilterClass: fabric.Image.filters.Contrast,
    },
    Contrast_value: {
        label: 'Contrast Value',
        type: 'slider',
        vender: 'Contrast',
        property: 'contrast',
        valueTransform: (val: number) => val / 100,
    },
    Saturation: {
        label: 'Saturation',
        FilterClass: fabric.Image.filters.Saturation,
    },
    Saturation_value: {
        label: 'Saturation Value',
        type: 'slider',
        vender: 'Saturation',
        property: 'saturation',
        valueTransform: (val: number) => val / 100,
    },
    HueRotation: {
        label: 'Hue',
        FilterClass: fabric.Image.filters.HueRotation,
    },
    Hue_value: {
        label: 'Hue Value',
        type: 'slider',
        vender: 'HueRotation',
        property: 'rotation',
        valueTransform: (val: number) => val / 100,
    },
    Noise: {
        label: 'Noise',
        FilterClass: fabric.Image.filters.Noise,
    },
    Noise_value: {
        label: 'Noise Value',
        type: 'slider',
        vender: 'Noise',
        property: 'noise',
        valueTransform: (val: string) => parseInt(val, 10),
    },
    Pixelate: {
        label: 'Pixelate',
        FilterClass: fabric.Image.filters.Pixelate,
    },
    Pixelate_value: {
        label: 'Pixelate Value',
        type: 'slider',
        vender: 'Pixelate',
        property: 'blocksize',
        valueTransform: (val: string) => parseInt(val, 10),
    },
    Blur: {
        label: 'Blur',
        FilterClass: fabric.Image.filters.Blur,
    },
    Blur_value: {
        label: 'Blur Value',
        type: 'slider',
        vender: 'Blur',
        property: 'blur',
        valueTransform: (val: number) => val / 10,
    },
    Convolute: {
        label: 'Sharpen',
        FilterClass: fabric.Image.filters.Convolute,
        args: {
            matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
        },
    },
    BlendColor: {
        label: 'BlendColor',
        FilterClass: fabric.Image.filters.BlendColor,
        args: {
            mode: 'add',
            color: '#000',
            alpha: 0,
        },
    },
    BlendColor_color: {
        label: 'Blend Color',
        vender: 'BlendColor',
        type: 'color',
        property: 'color',
    },
    BlendColor_alpha: {
        label: 'Blend Alpha',
        vender: 'BlendColor',
        type: 'slider',
        property: 'alpha',
        valueTransform: (val: number) => val / 100,
    },
};

const FilterForm = ({
    canvas,
    filterList,
}: FiltersProps & {
    filterList: Record<any, any>;
}) => {
    const [active, setActive] = useState<fabric.Object>();
    const [form] = ProForm.useForm();
    const forceUpdate = useForceUpdate();
    useEffect(() => {
        const curr = canvas.getActiveObject();
        setActive(curr);
        const values = {};
        curr.filters.forEach((item) => {
            values[item.type] = true;
        });
        form.setFieldsValue(values);
    }, []);

    if (!active) return null;

    const onValuesChange = (changed: any) => {
        const changeKey = Object.keys(changed)[0];
        const item = filterList[changeKey];
        let value = changed[changeKey];
        if (!item.type || item.type === 'checkbox') {
            const filter = active.filters.find((f) => f.type === changeKey);
            if (filter) {
                active.filters.splice(active.filters.indexOf(filter), 1);
            } else {
                active.filters.push(new item.FilterClass(item.args));
            }
        } else {
            const filter = active.filters.find((f) => f.type === item.vender);
            if (!filter) return;
            if (item.valueTransform) {
                value = item.valueTransform(value);
            }
            if (typeof item.property === 'function') {
                item.property(filter, value);
            } else {
                filter[item.property] = value;
            }
        }
        active.applyFilters();
        canvas.renderAll();
        forceUpdate();
    };
    return (
        <ProForm
            form={form}
            layout={'horizontal'}
            submitter={false}
            className={'drawingpad-menu_filters_form'}
            onValuesChange={onValuesChange}
        >
            {Object.keys(filterList).map((key) => {
                const item = filterList[key];
                const { type = 'checkbox', vender } = item;
                if (type === 'checkbox') {
                    return <ProFormCheckbox key={key} name={key} label={item.label} />;
                }
                if (!form.getFieldValue(vender)) {
                    form.resetFields([key]);
                    return null;
                }
                if (type === 'color') {
                    return (
                        <ProForm.Item label={item.label} name={key} key={key}>
                            <Input type={'color'} style={{ width: 50 }} />
                        </ProForm.Item>
                    );
                }
                if (type === 'slider') {
                    return <ProFormSlider width={100} key={key} name={key} label={item.label} />;
                }
                return null;
            })}
        </ProForm>
    );
};

const Filters = ({ canvas, isDrawingMode }: FiltersProps) => {
    const [disabled, setDisabled] = useState<boolean>(true);
    const [draggable, setDraggable] = useState<boolean>(false);
    const [activePanel, setActivePanel] = useState<string>('');
    const panels = [
        {
            name: 'Colors',
            component: (
                <FilterForm
                    filterList={ColorFilters}
                    canvas={canvas}
                    isDrawingMode={isDrawingMode}
                />
            ),
        },
        {
            name: 'Stylization',
            component: (
                <FilterForm
                    filterList={StylizationFilters}
                    canvas={canvas}
                    isDrawingMode={isDrawingMode}
                />
            ),
        },
    ];
    return (
        <div id={'drawingPad-menu-filter_container'} className={'inline'}>
            <Dropdown
                trigger={['click']}
                getPopupContainer={() =>
                    document.getElementById('drawingPad-menu-filter_container')!
                }
                onOpenChange={(v) => {
                    if (v) {
                        const active = canvas.getActiveObject();
                        setDisabled(!active || active.type !== 'image');
                    }
                }}
                menu={{
                    items: panels.map((p) => ({
                        disabled,
                        key: p.name,
                        label: p.name,
                    })),
                }}
            >
                <div className={'drawingpad-menu_act'}>
                    <FunctionOutlined />
                </div>
            </Dropdown>
            <Modal
                width={360}
                destroyOnClose
                styles={{
                    mask: {
                        backgroundColor: 'transparent',
                    },
                }}
                title={
                    <div
                        style={{
                            width: '100%',
                            cursor: 'move',
                        }}
                        onMouseOver={() => setDraggable(true)}
                        onMouseOut={() => setDraggable(false)}
                        onFocus={() => {}}
                        onBlur={() => {}}
                    >
                        {activePanel}
                    </div>
                }
                open={!!activePanel}
                footer={null}
                onCancel={() => setActivePanel('')}
                maskClosable={false}
                modalRender={(modal) => (
                    <Draggable disabled={!draggable}>
                        <div>{modal}</div>
                    </Draggable>
                )}
            >
                {activePanel && panels.find((n) => n.name === activePanel)?.component}
            </Modal>
        </div>
    );
};

export default Filters;
