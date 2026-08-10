import { ExportOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useContextValue } from '../../context';
import { valueToXmlString } from '../../xml';
import type { ToolbarMenuItem } from './index';

const Export: ToolbarMenuItem = ({ disabled }) => {
    const { value } = useContextValue();
    const exportPTML = () => {
        const content = valueToXmlString(value!);
        const a = document.createElement('a');
        const file = new Blob([content], { type: 'text/plain' });
        a.href = URL.createObjectURL(file);
        a.download = `${(value?.id || '') + Date.now()}.ptml`;
        a.click();
    };
    return (
        <>
            <Tooltip title={'Export as PTML'}>
                <Button
                    onClick={exportPTML}
                    disabled={disabled || !value}
                    type={'link'}
                    icon={<ExportOutlined />}
                />
            </Tooltip>
        </>
    );
};

export default Export;
