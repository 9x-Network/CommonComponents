import { createStyles } from 'antd-style';

const useStyles = createStyles(() => {
    return {
        list: {
            minWidth: '130px',
            padding: '0 8px',
        },
        item: {
            padding: '10px 12px',
            fontSize: '14px',
            backgroundColor: '#fff',
            borderRadius: '4px',
            cursor: 'grab',
            '&:not(:last-child)': {
                marginBottom: '6px',
            },
        },
        icon: {
            marginRight: '8px',
            fontSize: '14px',
        },
        title: {
            padding: '4px 0',
            color: '#808080',
            fontSize: '12px',
        },
    };
});
export default useStyles;
