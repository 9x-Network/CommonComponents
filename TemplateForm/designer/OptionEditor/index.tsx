import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, List, Space } from 'antd';
import useStyles from './style.style';
import Upsert from './Upsert';

export type ValueType = { label: string; value: string; key?: string; disabled?: boolean }[];

export interface OptionEditorProps {
    value?: ValueType;
    onChange?: (value?: ValueType) => void;
}

const OptionEditor = (props: OptionEditorProps) => {
    const { styles } = useStyles();
    const { value, onChange } = props;
    const handleAdd = (val: any) => {
        const newVal = value ? [...value] : [];
        newVal.push(val);
        onChange?.(newVal);
        return Promise.resolve(true);
    };
    const handleEdit = (newValue: any, item: any) => {
        Object.assign(item, newValue);
        onChange?.(value ? [...value] : []);
        return Promise.resolve(true);
    };
    const handleDel = (item: any) => {
        if (!value) return;
        const removeIndex = value.findIndex((n) => n === item);
        value.splice(removeIndex, 1);
        onChange?.([...value]);
    };
    return (
        <>
            {value && value.length > 0 && (
                <List bordered size={'small'}>
                    {value.map((item) => (
                        <List.Item
                            title={item.label}
                            key={item.key || item.value}
                            actions={[
                                <Upsert
                                    key={'edit'}
                                    data={item}
                                    onFinish={(values) => handleEdit(values, item)}
                                >
                                    <Button type={'link'} icon={<EditOutlined />} />
                                </Upsert>,
                                <Button
                                    onClick={() => handleDel(item)}
                                    key={'del'}
                                    danger
                                    type={'link'}
                                    icon={<DeleteOutlined />}
                                />,
                            ]}
                        >
                            <List.Item.Meta
                                title={item.label}
                                description={
                                    <Space className={styles.infos}>
                                        {item.key && <div>Key: {item.key}</div>}
                                        {item.disabled && <div>Disabled</div>}
                                    </Space>
                                }
                            />

                            <div>{item.value}</div>
                        </List.Item>
                    ))}
                </List>
            )}
            <Upsert onFinish={handleAdd}>
                <Button block className={styles.addBtn} icon={<PlusCircleOutlined />} />
            </Upsert>
        </>
    );
};

export default OptionEditor;
