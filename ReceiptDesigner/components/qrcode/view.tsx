import { QrcodeOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import type { QRCodeComponent } from './index';
import useStyles from './style.style';

const View: QRCodeComponent['View'] = ({ component }) => {
    const { styles } = useStyles();
    const { align, size } = component.attrs;
    return (
        <div className={classnames(styles.container, align && styles[align])}>
            <div className={styles.qrContainer}>
                <QrcodeOutlined className={classnames('qr', size)} />
            </div>
        </div>
    );
};

export default View;
