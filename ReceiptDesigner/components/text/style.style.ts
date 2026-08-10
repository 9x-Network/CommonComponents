import { createStyles } from 'antd-style';

const useStyles = createStyles(() => {
    return {
        text: {
            display: 'block',
            padding: '6px 0',
            textAlign: 'left',
            minHeight: '42px',
        },
        badge: {
            top: '-18px',
        },
    };
});
export default useStyles;
