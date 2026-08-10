import { createStyles } from 'antd-style';

const useStyles = createStyles(() => {
    return {
        container: {
            display: 'block',
            width: '100%',
            minHeight: '40px',
            '&:empty': { backgroundColor: '#fafafa' },
        },
    };
});
export default useStyles;
