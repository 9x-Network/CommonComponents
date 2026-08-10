import { BarcodeOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import type { BarCodeComponent } from './index';
import useStyles from './style.style';

const View: BarCodeComponent['View'] = ({ component }) => {
    const { styles } = useStyles();
    const { align, size } = component.attrs;
    return (
        <div className={classnames(styles.container, align && styles[align])}>
            <div className={styles.qrContainer}>
                <BarcodeOutlined className={classnames('qr', size)} />
            </div>
        </div>
    );
};

export default View;
