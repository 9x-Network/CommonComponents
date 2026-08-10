import { createStyles } from 'antd-style';

const useStyles = createStyles(() => {
    return {
        infos: {
            '&:empty': { display: 'none' },
        },
        addBtn: {
            marginTop: '6px',
        },
    };
});
export default useStyles;
