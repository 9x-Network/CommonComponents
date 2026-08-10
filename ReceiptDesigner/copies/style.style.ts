import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => {
    return {
        menu: {
            borderRight: '0',
        },
        addBtn: {
            height: '52px',
            textAlign: 'left',
            paddingLeft: '22px',
            borderTop: `1px solid ${token.colorSplit}`,
        },
        plusIco: {
            color: token.colorSuccess,
        },
        actIcon: {
            fontSize: '18px',
        },
    };
});

export default useStyles;
