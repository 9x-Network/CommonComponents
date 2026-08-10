import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => {
    return {
        container: {
            height: '100%',
            padding: '0 8px',
        },
        group: {
            backgroundColor: '#ffffff',
            marginBottom: '12px',
            minHeight: '30%',
            overflow: 'hidden',
        },
        title: {
            padding: '6px 0 12px 12px',
            color: '#bcbcbc',
            fontSize: '12px',
        },
        content: {
            paddingBottom: '32px',
        },
        active: {
            backgroundColor: '#e0e8e5',
            boxShadow: 'inset 0 0 6px 3px #bfdee6',
            transition: 'transform .3s',
        },
        innerFocus: {
            minHeight: '100%',
            '.breadcrumb >span:not(:last-child)': {
                cursor: 'pointer',
            },
        },
        component: {
            position: 'relative',
            cursor: 'pointer',
            background: '#ffffff',
            padding: '6px',
            marginBottom: '1px',
        },
        tag: {
            display: 'none',
            position: 'absolute',
            left: '0',
            top: '-12px',
        },
        arrow: {
            display: 'block',
            bottom: '0',
            transform: 'translate(calc(-50% - 8px), 100%)',
        },
        arrowContent: {
            transform: 'rotate(45deg) translateY(-11px)',
        },
        selected: {
            backgroundColor: '#ecedf1',
            outline: '1px solid #6667AB',
        },
        dragging: {
            opacity: '0',
        },
        up: {
            transform: 'skewX(-6deg) translateY(12px)',
            borderTop: `1px solid ${token.colorPrimary}`,
        },
        down: {
            transform: 'skewX(6deg) translateY(-12px)',
            borderBottom: `1px solid ${token.colorPrimary}`,
        },
    };
});

export default useStyles;
