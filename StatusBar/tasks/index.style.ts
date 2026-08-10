import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => {
    return {
        overlay: {
            width: '500px',
            '.ant-popover-inner': { padding: 0 },
        },
        tip: {
            marginLeft: token.margin,
            color: token.colorBgSpotlight,
            fontSize: token.fontSizeSM,
            '.anticon': { marginRight: '3px' },
        },
        actions: {
            'a:not(:last-child)': { marginRight: token.marginSM },
        },
        card: {
            '.ant-card-body': { padding: '0' },
            '.ant-list-pagination': { marginTop: '12px', paddingRight: '24px' },
        },
        list: {
            paddingBottom: '12px',
            '.ant-list-item': { 
                padding: '12px 24px',
            },
        },
        listItem: {
            padding: '12px 24px',
        },
        clickable: {
            cursor: 'pointer',
            '&:hover': { backgroundColor: token.colorPrimaryBg },
        },
    };
});

export default useStyles;
