import { createStyles } from 'antd-style';

const useStyles = createStyles(() => {
    return {
        container: {
            textAlign: 'left',
        },
        img: {
            width: '82px',
            minWidth: '82px',
            maxWidth: '100%',
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
