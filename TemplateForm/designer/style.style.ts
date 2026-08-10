import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => {
    return {
        navbar: {
            width: '100%',
            padding: '2px 8px',
            overflow: 'hidden',
            color: token.colorWhite,
            backgroundColor: token.colorPrimary,
            borderTopLeftRadius: token.borderRadiusSM,
            borderTopRightRadius: token.borderRadiusSM,
            '.anticon': { color: token.colorWhite },
        },
        visual: {
            height: '100%',
            minHeight: '300px',
            overflow: 'hidden',
            border: `1px solid ${token.colorBorder}`,
            borderTop: '0',
        },
        split: {
            display: 'flex',
            flexDirection: 'row',
            height: '100%',
            '.gutter': {
                backgroundColor: '#eee',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '50%',
                '&-horizontal': {
                    backgroundImage:
                        "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==')",
                    cursor: 'col-resize',
                },
            },
            '.col': {
                //padding: 8px;
            },
        },
        components: {
            height: '100%',
            overflowY: 'auto',
            '.innerContent': {
                minWith: 220,
                overflowX: 'auto',
            },
            '.item': {
                position: 'relative',
                padding: '8px',
                cursor: 'grab',
                '&::after': {
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    bottom: '0',
                    left: '0',
                    content: "' '",
                },
                '&:hover': { backgroundColor: token.colorPrimaryBgHover },
            },
        },
        workplate: {
            height: '100%',
            overflowY: 'auto',
            '.innerContent': {
                minWidth: '300px',
                overflowX: 'auto',
                paddingTop: '8px',
                paddingBottom: '260px',
            },
            '&.active': {
                backgroundColor: token.colorPrimaryBgHover,
                '.formItem:last-child': {
                    borderBottom: `solid 3px ${token.colorPrimary}`,
                },
            },
            '.formItem': {
                position: 'relative',
                zIndex: '1',
                backgroundColor: token.colorWhite,
                '.ant-row': { padding: '12px' },
                '.ant-form-item-control': {
                    flex: 'none',
                },
                '.ant-form-item': {
                    marginBottom: '0',
                },
                '&::after': {
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    zIndex: '2',
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer',
                    content: "' '",
                },
                '&.active': {
                    backgroundColor: token.colorPrimaryBgHover,
                    '&::before': {
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        left: '0',
                        height: '3px',
                        backgroundColor: token.colorPrimary,
                        content: "' '",
                    },
                },
                '&.selected': {
                    backgroundColor: token.colorPrimaryBgHover,
                },
            },
        },
        controller: {
            height: '100%',
            padding: '12px',
            overflowY: 'auto',
            '.innerContent': {
                minWidth: '300px',
                overflowX: 'auto',
            },
            '.ant-form-item-control': {
                flex: 'none',
            },
        },
    };
});

export default useStyles;
