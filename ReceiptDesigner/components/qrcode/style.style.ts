import { createStyles } from 'antd-style';

const useStyles = createStyles(() => {
    return {
        container: {
            textAlign: 'left',
        },
        start: {
            textAlign: 'left',
        },
        center: {
            textAlign: 'center',
        },
        end: {
            textAlign: 'right',
        },
        qrContainer: {
            color: '#8c8c8c',
            '.qr': {
                fontSize: '98px',
            },
            '&.s': {
                fontSize: '68px',
            },
            '&.l': {
                fontSize: '128px',
            },
        },
    };
});
export default useStyles;
