import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => {
    return {
        readonlyMask: {
            position: 'relative',
            '&::after': {
                position: 'absolute',
                top: '0',
                right: '0',
                bottom: '0',
                left: '0',
                display: 'block',
                content: "' '",
            },
            '.ant-select-selector': { padding: '0', border: '0' },
            '.ant-select-selection-search, .ant-select-arrow, .ant-select-clear': {
                display: 'none',
            },
        },
        warning: {
            color: token.colorWarning,
            marginTop: '4px',
        },
    };
});
export default useStyles;
