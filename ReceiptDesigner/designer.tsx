import classnames from 'classnames';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Split from 'react-split';
import Copies from './copies';
import useStyles from './index.style';
import type { Groups, ValueType } from './interface';
import Content from './views/content';
import Library from './views/library';
import Properties from './views/properties';

export type DisabledParts = {
    copy?: boolean;
    library?: boolean;
    content?: boolean | Groups[];
    property?: boolean;
    toolbar?: boolean;
};
export interface DesignerProps {
    className?: string;
    style?: React.CSSProperties;
    value?: ValueType;
    defaultValue?: ValueType;
    onChange?: (val: ValueType) => void;
    disabled?: boolean | DisabledParts;
    selectedCopy?: string | null;
    defaultSelectedCopy?: string | null;
    onCopySelected?: (copy: string | null) => void;
    lockedGroups?: Groups[];
}

const Designer = (props: DesignerProps) => {
    const { styles } = useStyles();
    const { className, style } = props;

    return (
        <Split
            className={classnames(styles.designer, className)}
            style={style}
            sizes={[15, 20, 40, 30]}
            gutterSize={8}
            gutterAlign={'center'}
            snapOffset={30}
            direction={'horizontal'}
            cursor={'col-resize'}
        >
            <div className={styles.col}>
                <div className={styles.title}>Copies</div>
                <div className={styles.content}>
                    <Copies />
                </div>
            </div>
            <DndProvider backend={HTML5Backend}>
                <div className={classnames(styles.col, 'gray')}>
                    <div className={styles.title}>Library</div>
                    <div className={styles.content}>
                        <Library />
                    </div>
                </div>
                <div className={classnames(styles.col, 'gray')}>
                    <div className={styles.title}>Content</div>
                    <div className={styles.content}>
                        <Content />
                    </div>
                </div>
                <div className={styles.col}>
                    <div className={styles.title}>Properties</div>
                    <div className={styles.content}>
                        <Properties />
                    </div>
                </div>
            </DndProvider>
        </Split>
    );
};

export default Designer;
