import { CodeOutlined, CopyOutlined } from '@ant-design/icons';
import { Button, message, Modal, Tooltip } from 'antd';
import copy from 'copy-to-clipboard';
import { useState } from 'react';
import XMLViewer from 'react-xml-viewer';
import { useContextValue } from '../../context';
import { valueToXmlString } from '../../xml';
import type { ToolbarMenuItem } from './index';

const XmlView: ToolbarMenuItem = ({ disabled }) => {
    const { value } = useContextValue();
    const [xml, setXml] = useState<string | null>();
    const view = () => {
        setXml(valueToXmlString(value!));
    };
    const closeModal = () => setXml(null);
    return (
        <>
            <Tooltip title={'Show XML data'}>
                <Button
                    disabled={disabled || !value}
                    type={'link'}
                    icon={<CodeOutlined />}
                    onClick={view}
                />
            </Tooltip>
            <Modal
                open={!!xml}
                title={
                    <>
                        <label>PTML</label>
                        <Button
                            title={'Copy'}
                            onClick={() => {
                                copy(xml!);
                                message.success('Has been copied to the clipboard');
                            }}
                            icon={<CopyOutlined />}
                            type={'link'}
                        />
                    </>
                }
                cancelButtonProps={{ style: { display: 'none' } }}
                onOk={closeModal}
                onCancel={closeModal}
                width={'80vw'}
            >
                {xml && (
                    <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
                        <XMLViewer xml={xml} indentSize={4} />
                    </div>
                )}
            </Modal>
        </>
    );
};

export default XmlView;
