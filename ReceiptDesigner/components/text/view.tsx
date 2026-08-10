import { FieldStringOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import React, { useMemo } from 'react';
import { useContextValue } from '../../context';
import type { TextComponent } from './index';
import useStyles from './style.style';

const View: TextComponent['View'] = ({ component: { attrs, children } }) => {
    const { styles } = useStyles();
    const { align = 'left', size = 'm', visibility } = attrs;
    const { value } = useContextValue();

    const content = useMemo<React.ReactNode>(() => {
        const fontSizes = {
            s: 12,
            m: 16,
            l: 20,
        };
        const fontSize = fontSizes[size];
        const style: React.CSSProperties = {
            textAlign: align as any,
            fontSize,
            zoom: value?.fontScale,
        };
        if (attrs.bold) {
            style.fontWeight = 'bold';
        }
        if (attrs.italic) {
            style.fontStyle = 'italic';
        }
        if (value?.fontFamily) {
            style.fontFamily = value.fontFamily;
        }
        return (
            <div className={styles.text} style={style}>
                {children}
            </div>
        );
    }, [attrs, value]);
    return visibility === 'whenVariablesNotEmpty' ? (
        <Badge.Ribbon
            placement={'end'}
            text={<FieldStringOutlined key={'visible'} />}
            color={'cyan'}
            className={styles.badge}
        >
            {content}
        </Badge.Ribbon>
    ) : (
        <>{content}</>
    );
};

export default View;
