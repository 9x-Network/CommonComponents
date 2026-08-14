import { EllipsisOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Dropdown, Menu, Modal, Row } from 'antd';
import { useRef } from 'react';
import { useIntl } from '@umijs/max';
import { useContextValue, useDisabledParts } from '../context';
import type { Copy } from '../interface';
import useStyles from './style.style';
import type { UpsertRef, UpsertValue } from './Upsert';
import Upsert from './Upsert';

const Copies = () => {
    const { styles } = useStyles();
    const { value, mergeValue, selectedCopy, currentCopy, setSelectedCopy, update } =
        useContextValue();
    const disabled = useDisabledParts().copy;
    const { formatMessage } = useIntl();
    const upsertRef = useRef<UpsertRef>();
    const copies = value?.copies || [];
    const handleNew = (addVal: UpsertValue) => {
        if (copies.some((item) => item.id === addVal.id)) {
            Modal.error({
                content: formatMessage({ id: 'component.receiptDesigner.copies.idDup' }),
            });
            return Promise.resolve(false);
        }
        mergeValue({
            copies: [...copies, addVal],
        });
        // 自动选中新创建的票联
        setSelectedCopy(addVal.id);
        return Promise.resolve(true);
    };

    const handleUpdate = (updateVal: Partial<Copy>) => {
        Object.assign(currentCopy!, updateVal);
        update();
        setSelectedCopy(currentCopy!.id);
        return Promise.resolve(true);
    };

    const onMenuClick = (action: string, copy: Copy) => {
        switch (action) {
            case 'edit':
                upsertRef.current?.show(handleUpdate, copy);
                break;
            case 'delete':
                Modal.confirm({
                    title: formatMessage({ id: 'component.receiptDesigner.copies.delConfirm' }),
                    onOk: () => {
                        copies.splice(
                            copies.findIndex((c) => c.id === selectedCopy),
                            1,
                        );
                        setSelectedCopy(undefined);
                        update();
                    },
                });
                break;
            case 'duplicate':
                upsertRef.current?.show((val) => handleNew({ ...copy, ...val }), copy);
                break;
            default:
                break;
        }
    };

    return (
        <div>
            <Menu
                className={styles.menu}
                mode={'inline'}
                selectedKeys={selectedCopy ? [selectedCopy] : []}
                onClick={(evt) => {
                    setSelectedCopy(evt.key);
                }}
            >
                {copies.map((item) => (
                    <Menu.Item key={item.id}>
                        <Row align={'middle'} wrap={false}>
                            <Col flex={1}>{item.name}</Col>
                            {!disabled && selectedCopy === item.id && (
                                <Col>
                                    <Dropdown
                                        trigger={['click']}
                                        menu={{
                                            items: [
                                                {
                                                    key: 'edit',
                                                    label: formatMessage({
                                                        id: 'component.receiptDesigner.copies.edit',
                                                    }),
                                                },
                                                {
                                                    key: 'duplicate',
                                                    label: formatMessage({
                                                        id: 'component.receiptDesigner.copies.duplicate',
                                                    }),
                                                },
                                                {
                                                    key: 'delete',
                                                    label: formatMessage({
                                                        id: 'component.receiptDesigner.copies.delete',
                                                    }),
                                                },
                                            ],
                                            onClick: (evt) => onMenuClick(evt.key, item),
                                        }}
                                    >
                                        <EllipsisOutlined className={styles.actIcon} />
                                    </Dropdown>
                                </Col>
                            )}
                        </Row>
                    </Menu.Item>
                ))}
            </Menu>
            <Button
                disabled={disabled}
                type={'text'}
                block
                className={styles.addBtn}
                icon={<PlusCircleOutlined className={styles.plusIco} />}
                onClick={() => {
                    upsertRef.current?.show(handleNew);
                }}
            >
                {formatMessage({ id: 'component.receiptDesigner.copies.new' })}
            </Button>
            <Upsert ref={upsertRef} />
        </div>
    );
};

export default Copies;
