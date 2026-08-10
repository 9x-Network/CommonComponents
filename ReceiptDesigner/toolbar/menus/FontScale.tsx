import { LineHeightOutlined } from '@ant-design/icons';
import { Button, Popover, Slider, Tooltip } from 'antd';
import { useContextValue } from '../../context';
import type { ToolbarMenuItem } from './index';

const FontScale: ToolbarMenuItem = ({ disabled }) => {
    const { value, setValue } = useContextValue();
    const scale = value?.fontScale || 1;
    return (
        <Popover
            trigger={'click'}
            content={
                <div>
                    <h5>Font Scale: {scale}</h5>
                    <Slider
                        disabled={disabled}
                        min={0.5}
                        max={5}
                        step={0.1}
                        style={{ width: 200 }}
                        value={+scale}
                        onChange={(v) => {
                            setValue({
                                ...value!,
                                fontScale: v,
                            });
                        }}
                    />
                </div>
            }
        >
            <Tooltip title={'Font Scale'}>
                <Button disabled={disabled || !value} type={'link'} icon={<LineHeightOutlined />} />
            </Tooltip>
        </Popover>
    );
};

export default FontScale;
