import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => {
    return {
        container: {
            backgroundColor: token.colorWhite,
        },
        designer: {
            minWidth: '600px',
            minHeight: '360px',
            display: 'flex',
            flexDirection: 'row',
            '.gutter': {
                backgroundColor: 'rgba(219, 234, 219, 0.2)',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '50%',
                '&-horizontal': {
                    backgroundImage:
                        "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==')",
                    cursor: 'col-resize',
                },
            },
        },
        col: {
            display: 'flex',
            flexDirection: 'column',
            '&.gray': {
                backgroundColor: token.colorFillTertiary,
            },
        },
        title: {
            color: token.colorTextSecondary,
            fontSize: '12px',
            padding: '8px',
        },
        content: {
            flex: 'auto',
            overflowX: 'hidden',
            overflowY: 'auto',
        },
    };
});
export default useStyles;
