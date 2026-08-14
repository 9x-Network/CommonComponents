import GlobalLangInput from '@/components/GlobalLangInput';
import { getValueFromLocaleJSON } from '@/utils/utils';
import { GlobalOutlined } from '@ant-design/icons';
import { getLocale } from '@umijs/max';
import { Col, Input, Row, Tag } from 'antd';
import { useState } from 'react';

type Value = string | Record<string, string>;

export interface MultipleLangInputProps {
    value?: Value;
    onChange?: (value?: Value) => void;
}

const MultipleLangInput = (props: MultipleLangInputProps) => {
    const { value, onChange } = props;
    const [isGlobal, setIsGlobal] = useState<boolean>(value ? typeof value !== 'string' : false);

    const changeGlobalMode = (mode: boolean) => {
        if (value) {
            if (typeof value === 'string') {
                onChange?.({ [getLocale()]: value });
            } else {
                onChange?.(getValueFromLocaleJSON(value));
            }
        }
        setIsGlobal(mode);
    };

    return (
        <Row align={'middle'}>
            <Col flex={1}>
                {isGlobal ? (
                    <GlobalLangInput value={value} onChange={onChange} />
                ) : (
                    <Input
                        value={value as string}
                        onChange={(evt) => onChange?.(evt.target.value)}
                        allowClear
                    />
                )}
            </Col>
            <Col>
                <Tag.CheckableTag
                    style={{ marginLeft: 3 }}
                    checked={isGlobal}
                    onChange={changeGlobalMode}
                >
                    <GlobalOutlined />
                </Tag.CheckableTag>
            </Col>
        </Row>
    );
};

export default MultipleLangInput;
