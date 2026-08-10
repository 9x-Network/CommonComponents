import { createStyles } from 'antd-style';

const useStyles = createStyles(() => {
    return {
        container: {
            position: 'relative',
            zIndex: '8',
            minHeight: '100%',
            padding: '0 8px 12px 8px',
        },
        type: {
            color: '#a29f9f',
            marginBottom: '12px',
            borderBottom: '1px solid #d9d9d9',
        },
        disabledMask: {
            position: 'absolute',
            backgroundColor: 'rgba(255,255,255,.3)',
            left: '0',
            right: '0',
            top: '0',
            bottom: '0',
            zIndex: '9',
        },
    };
});
export default useStyles;
