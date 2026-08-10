import CodeAssociateInput from '@/components/common/CodeAssociateInput';
import Uploader from '@/components/common/Uploader';
import { getRemoteFile } from '@/services/basis';
import { UploadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { CommonGeneralSettings, useIntl } from 'umi';

const Upload = ({ value, onChange }: { value?: string; onChange?: (value?: string) => void }) => {
    const { formatMessage } = useIntl();
    const [uploading, setUploading] = React.useState<boolean>(false);
    const onUploaded = (url?: string | string[]) => {
        const urlStr = Array.isArray(url) ? url[0] : url;
        const fullUrl = urlStr ? getRemoteFile(urlStr) : urlStr;
        onChange?.(fullUrl);
    };
    return (
        <>
            <CodeAssociateInput
                value={value}
                onChange={onChange}
                variables={CommonGeneralSettings.receiptDesigner.autocomplete.image}
                rows={2}
                style={{ marginBottom: 4 }}
            />
            <Uploader
                accept={'image/*'}
                showUploadList={false}
                multiple={false}
                onChange={onUploaded}
                onUploadChange={(evt) => {
                    setUploading(evt.file.status === 'uploading');
                }}
            >
                <Button loading={uploading} type={'primary'} icon={<UploadOutlined />}>
                    {formatMessage({ id: 'component.receiptDesigner.comp.img.ctr.upload' })}
                </Button>
            </Uploader>
        </>
    );
};

export default Upload;
