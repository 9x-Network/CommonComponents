import { createStyles } from 'antd-style';

const useStyles = createStyles(() => {
    return {
        container: {
            textAlign: 'left',
        },
        qrContainer: {
            color: '#8c8c8c',
            '.qr': {
                fontSize: '68px',
                '&.s': {
                    fontSize: '48px',
                },
                '&.l': {
                    fontSize: '108px',
                },
            },
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
    };
});
export default useStyles;
