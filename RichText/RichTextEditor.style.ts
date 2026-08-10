import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => {
    return {
        container: {
            border: `1px solid ${token.colorBorder}`,
            '.w-e-text-container': {
                verticalAlign: 'bottom',
            },
            '.w-e-text-container [data-slate-editor] span': {
                verticalAlign: 'bottom',
            },
        },
        toolbar: {
            borderBottom: `1px solid ${token.colorBorder}`,
        },
    };
});

export default useStyles;
