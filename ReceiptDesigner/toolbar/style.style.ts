import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => {
    return {
        toolbar: {
            padding: '12px',
            borderBottom: `solid 1px ${token.colorSplit}`,
            marginBottom: '1px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            '.extra': {
                display: 'flex',
            },
            '.item::empty': {
                display: 'none',
            },
            '.custom': {
                marginLeft: '16px',
            },
        },
    };
});

export default useStyles;
