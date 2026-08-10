import type { JSONEditorInstance } from '@/components/common/JSONEditor';
import JSONEditor from '@/components/common/JSONEditor';
import { unique } from '@/utils/utils';
import { BorderlessTableOutlined } from '@ant-design/icons';
import ProForm, { ModalForm } from '@ant-design/pro-form';
import type { MentionProps } from 'antd';
import { Button, Mentions, message } from 'antd';
import { useMemo, useRef } from 'react';
import useStyles from './style.style';

export interface CodeAssociateInputProps extends Omit<MentionProps, 'prefix'> {
    variables?: string[];
    mappable?: boolean;
    mappings?: Record<any, any>;
    onMappingsChange?: (mappings?: Record<any, any>) => void;
}

const CodeAssociateInput = (props: CodeAssociateInputProps) => {
    const { styles } = useStyles();
    const { mappable = false, variables, value, mappings, onMappingsChange, ...rest } = props;
    const jsonEditorRef = useRef<JSONEditorInstance>();

    const sv = useMemo(() => {
        if (!variables) return [];
        return unique(variables);
    }, [variables]);

    const hasVariable = useMemo<boolean>(() => {
        if (!value || !mappable) return false;
        return /{[\w._$]+}/g.test(value);
    }, [value, mappable]);

    const hasMapping = useMemo<boolean>(() => {
        return mappings ? Object.keys(mappings).length > 0 : false;
    }, [mappings]);

    const handleFinish = (val: any) => {
        return jsonEditorRef.current!.validate().then((errors) => {
            if (errors.length) {
                message.error('Config error');
                return false;
            }
            onMappingsChange?.(val.mappings);
            return true;
        });
    };
    return (
        <div className={styles.container}>
            <Mentions prefix={'{'} value={value} {...rest}>
                {sv.map((item) => (
                    <Mentions.Option value={`${item}}`} key={item}>
                        {`{${item}}`}
                    </Mentions.Option>
                ))}
            </Mentions>
            {hasVariable && (
                <ModalForm
                    trigger={
                        <Button
                            type={hasMapping ? 'primary' : 'default'}
                            className={styles.icon}
                            size={'small'}
                            shape={'circle'}
                            icon={<BorderlessTableOutlined />}
                        />
                    }
                    title={'Mappings'}
                    onFinish={handleFinish}
                    modalProps={{
                        destroyOnClose: true,
                    }}
                >
                    <ProForm.Item name={'mappings'} initialValue={mappings}>
                        <JSONEditor ref={jsonEditorRef} style={{ height: 380 }} />
                    </ProForm.Item>
                </ModalForm>
            )}
        </div>
    );
};

export default CodeAssociateInput;
