import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Split from 'react-split';
import useStyles from './style.style';
import VisualComponents from './Visual.Components';
import VisualController from './Visual.Controller';
import VisualWorkPlate from './WorkPlate';

const Visual = () => {
    const { styles } = useStyles();
    return (
        <DndProvider backend={HTML5Backend}>
            <div className={styles.visual}>
                <Split
                    className={styles.split}
                    sizes={[20, 30, 50]}
                    gutterSize={10}
                    gutterAlign={'center'}
                    snapOffset={30}
                    direction={'horizontal'}
                    cursor={'col-resize'}
                >
                    <div className={'col'}>
                        <VisualComponents />
                    </div>
                    <div className={'col'}>
                        <VisualWorkPlate />
                    </div>
                    <div className={'col'}>
                        <VisualController />
                    </div>
                </Split>
            </div>
        </DndProvider>
    );
};

export default Visual;
