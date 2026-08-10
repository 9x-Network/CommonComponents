import classnames from 'classnames';
import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { groupedList } from '../../components';
import { useContextValue, useDisabledParts } from '../../context';
import type { ComponentDeclare } from '../../interface';
import useStyles from './style.style';

const DraggableComponent = ({ data }: { data: ComponentDeclare }) => {
    const { styles } = useStyles();
    const { setSelectedComponent } = useContextValue();
    const disabled = useDisabledParts().library;
    const [{ isDragging }, drag] = useDrag(() => {
        return {
            type: 'library',
            item: data,
            canDrag: !disabled,
            options: {
                dropEffect: 'copy',
            },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        };
    }, []);

    // 拖动新组件的时候取消当前选中
    useEffect(() => {
        if (isDragging) {
            setSelectedComponent(undefined);
        }
    }, [isDragging, setSelectedComponent]);

    return (
        <div key={data.type} className={classnames(styles.item)} ref={drag}>
            <span className={styles.icon}>{data.icon}</span>
            <label>{data.name}</label>
        </div>
    );
};

const Library = () => {
    const { styles } = useStyles();
    const { currentCopy } = useContextValue();
    if (!currentCopy) return null;
    return (
        <div className={styles.list}>
            <div className={styles.title}>Containers</div>
            {groupedList.containers.map((item) => (
                <DraggableComponent data={item} key={item.type} />
            ))}
            <div className={styles.title}>Components</div>
            {groupedList.components.map((item) => (
                <DraggableComponent data={item} key={item.type} />
            ))}
        </div>
    );
};

export default Library;
