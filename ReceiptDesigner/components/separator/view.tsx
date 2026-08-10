import classnames from 'classnames';
import type { SeparatorComponent } from './index';
import useStyles from './style.style';

const View: SeparatorComponent['View'] = ({ component: { attrs } }) => {
    const { styles } = useStyles();
    const { appearance, size } = attrs;
    return <div className={classnames(styles.container, styles[appearance], size, appearance)} />;
};

export default View;
