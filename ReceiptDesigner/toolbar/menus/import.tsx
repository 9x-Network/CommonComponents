import { xmlToValue } from '@/components/common/ReceiptDesigner/xml';
import { ImportOutlined } from '@ant-design/icons';
import { Button, message, Tooltip, Upload } from 'antd';
import { useState } from 'react';
import { useContextValue } from '../../context';
import type { ToolbarMenuItem } from './index';

const Import: ToolbarMenuItem = ({ disabled, lang }) => {
    const { setValue, value, setSelectedCopy } = useContextValue();
    const [busy, setBusy] = useState<boolean>(false);
    const onFile = (file: File) => {
        if (!/\.ptml/.test(file.name)) {
            message.warning('Only Support PTML file');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setBusy(false);
            const xml = reader.result?.toString();
            if (xml) {
                const nv = xmlToValue(xml);
                nv.lang = value?.lang || lang;
                setValue(nv);
                message.success('Success!');
                setTimeout(() => {
                    const firstCopy = nv?.copies?.[0]?.id;
                    console.log(firstCopy, 'firstCopy');
                    setSelectedCopy(firstCopy);
                });
            }
        };
        reader.onerror = () => {
            setBusy(false);
            message.error('File read error!');
        };
        setBusy(true);
        reader.readAsText(file);
    };
    const onCustomRequest = async () => {
        return new Promise<void>((resolve) => {
            resolve();
        });
    };
    return (
        <>
            <Tooltip title={'Import from PTML'}>
                <Upload
                    beforeUpload={onFile}
                    showUploadList={false}
                    customRequest={onCustomRequest}
                >
                    <Button
                        disabled={disabled}
                        loading={busy}
                        type={'link'}
                        icon={<ImportOutlined />}
                    />
                </Upload>
            </Tooltip>
        </>
    );
};

export default Import;
