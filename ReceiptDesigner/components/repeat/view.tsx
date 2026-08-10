import { SyncOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import classnames from 'classnames';
import { getComponentDeclare } from '../../components';
import type { RepeatComponent } from './index';
import useStyles from './style.style';

const View: RepeatComponent['View'] = ({ component: { children } }) => {
    const { styles } = useStyles();
    return (
        <Badge
            count={<SyncOutlined style={{ color: '#723ccc' }} />}
            className={classnames(styles.container)}
        >
            {children?.map((item) => {
                const componentDeclare = getComponentDeclare(item.type);
                return componentDeclare ? (
                    <div key={item.id}>
                        <componentDeclare.View component={item as any} />
                    </div>
                ) : (
                    <span className={'text-danger'}>Unknown component</span>
                );
            })}
        </Badge>
    );
};

export default View;
