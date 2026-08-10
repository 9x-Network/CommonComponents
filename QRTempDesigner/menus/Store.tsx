import { DeliveredProcedureOutlined } from '@ant-design/icons';
import { Dropdown, Modal, Upload } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import moment from 'moment';
import { useRef } from 'react';
import type { MenuProps } from './index';

const Store = (props: MenuProps) => {
    const { canvas } = props;

    const uploadTriggerRef = useRef<HTMLDivElement>(null);

    const onMenu = (act: string) => {
        switch (act) {
            case 'import':
                uploadTriggerRef.current?.click();
                break;
            case 'export-project':
                {
                    const json = canvas.toJSON();
                    const fileName = `dp-${moment().format('YYYYMMDD-HHmmss')}.jdp`;
                    const downloadLink = document.createElement('a');
                    downloadLink.download = fileName;
                    const text = JSON.stringify(json);
                    downloadLink.href = `data:text/plain,${encodeURIComponent(text)}`;
                    downloadLink.click();
                }
                break;
            case 'export-svg':
                {
                    const svg = canvas.toSVG();
                    const fileName = `dp-${moment().format('YYYYMMDD-HHmmss')}.svg`;
                    const downloadLink = document.createElement('a');
                    downloadLink.download = fileName;
                    downloadLink.href = `data:text/plain,${encodeURIComponent(svg)}`;
                    downloadLink.click();
                }
                break;
            default:
                break;
        }
    };

    const importProject = (file: RcFile) => {
        if (window.FileReader) {
            const reader = new FileReader();
            if (!/\.jdp$/.test(file.name)) {
                Modal.error({
                    title: '只支持jdp格式文件',
                });
                return false;
            }
            reader.onload = () => {
                if (!reader.result || typeof reader.result !== 'string') return;
                const json = JSON.parse(decodeURIComponent(reader.result));
                canvas.loadFromJSON(json, () => {
                    canvas.renderAll();
                });
            };
            reader.readAsText(file);
        } else {
            // Modal.error({
            //     content: formatMessage({ id: 'page.system.user.menu.toolbar.import.notSupport' }),
            // });
        }
        return false;
    };

    return (
        <div id={'drawingPad-menu-store_container'} className={'inline'}>
            <Dropdown
                trigger={['click']}
                getPopupContainer={() => document.getElementById('drawingPad-menu-qr_container')!}
                menu={{
                    items: [
                        {
                            key: 'import',
                            label: 'Import Project',
                        },
                        {
                            key: 'export-project',
                            label: 'Export Project',
                        },
                        {
                            key: 'export-svg',
                            label: 'Export SVG',
                        },
                    ],
                    onClick: ({ key }) => onMenu(key),
                }}
            >
                <div className={'drawingpad-menu_act'}>
                    <DeliveredProcedureOutlined />
                </div>
            </Dropdown>
            <Upload beforeUpload={importProject} showUploadList={false}>
                <div ref={uploadTriggerRef} />
            </Upload>
        </div>
    );
};

export default Store;
