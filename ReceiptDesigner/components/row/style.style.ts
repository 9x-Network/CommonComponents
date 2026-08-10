import { createStyles } from 'antd-style';

const useStyles = createStyles(() => {
    return {
        container: {
            position: 'relative',
            minHeight: '40px',
            width: '100%',
            overflow: 'hidden',
            padding: '0 4px',
            display: 'flex',
            flexDirection: 'row',
            '&:empty': { backgroundColor: '#fafafa' },
            '>.item': { display: 'block', flexGrow: '0', flexShrink: '0', overflow: 'hidden' },
        },
        spaceBetween: {
            justifyContent: 'space-between',
        },
        badge: {
            top: '-18px',
        },
    };
});
export default useStyles;
