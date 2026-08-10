import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => {
    return {
        select: {
            minWidth: '62px',
            maxWidth: '200px',
            '.ant-select-selector': { border: '0', boxShadow: 'none' },
            '.ant-select-selection-item': { flex: 'none' },
            '.code': {
                color: 'inherit',
                flex: 'auto',
                marginRight: '8px',
            },
            '.country': {
                display: 'none',
                color: token.colorBgSpotlight,
            },
        },
        dropdown: {
            maxWidth: '400px',
            '.item': {
                display: 'flex',
                justifyContent: 'space-between',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
            },
        },
        input: {},
    };
});

export default useStyles;
