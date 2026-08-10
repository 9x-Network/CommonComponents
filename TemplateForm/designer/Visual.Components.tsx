import { useMemo } from 'react';
import { useDrag } from 'react-dnd';
import type { Component } from './components';
import { ComponentMap } from './components';
import { useDesignerContext } from './context';
import useStyles from './style.style';

function DraggableComponent(props: { component: Component }) {
    const { component } = props;
    const { disabled } = useDesignerContext();
    const [_, drag] = useDrag(() => ({
        type: 'component',
        item: component,
        canDrag: !disabled,
        options: {
            dropEffect: 'copy',
        },
    }));
    return (
        <div className={'item'} ref={drag}>
            <div>{component.name}</div>
            <div>{component.renderThumb()}</div>
        </div>
    );
}

const VisualComponents = () => {
    const { styles } = useStyles();
    const children = useMemo(() => {
        return Object.values(ComponentMap).map((comp) => {
            return <DraggableComponent component={comp} key={comp.name} />;
        });
    }, []);
    return (
        <div className={styles.components}>
            <div className={'innerContent'}>{children}</div>
        </div>
    );
};

export default VisualComponents;
