import { FieldStringOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import classnames from 'classnames';
import React from 'react';
import { getComponentDeclare } from '../../components';
import type { RowComponent } from './index';
import useStyles from './style.style';

const View: RowComponent['View'] = ({ component: { attrs, children } }) => {
    const { styles } = useStyles();
    const { spaceBetween, visibility, gap } = attrs;

    const content = (
        <div
            className={classnames(styles.container, { [styles.spaceBetween]: spaceBetween })}
            style={{ gap: gap && `${gap}em` }}
        >
            {children?.map((item) => {
                const componentDeclare = getComponentDeclare(item.type);
                if (!componentDeclare)
                    return <span className={'text-danger'}>Unknown component</span>;
                const style: React.CSSProperties = {};
                if (spaceBetween) {
                    style.flex = 'initial';
                } else if (!componentDeclare.isVirtualTag) {
                    const flex = item.attrs?.weight;
                    style.flex = flex != null && flex >= 0 ? flex : 1;
                }
                return (
                    <div key={item.id} style={style}>
                        <componentDeclare.View component={item as any} />
                    </div>
                );
            })}
        </div>
    );

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
        content
    );
};

export default View;
