import { createStyles } from 'antd-style';
import blank_bg from '../../assets/blank_bg.jpg';

const useStyles = createStyles(() => {
    return {
        container: {
            height: 20,
            display: 'flex',
            alignItems: 'center',
            '&.m': {
                height: 40,
            },
            '&.l': {
                height: 60,
            },
            '&::after': {
                content: '""',
                display: 'block',
                flex: 1,
            },
            '&.blank-line::after': {
                height: '100%',
                background: `url(${blank_bg}) repeat`,
            },
            '&.solid-line::after': {
                borderBottom: '1px solid #ccc',
            },
            '&.dotted-line::after': {
                borderBottom: '1px dashed #ccc',
            },
        },
    };
});
export default useStyles;
