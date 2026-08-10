import { useMemo } from 'react';
import { useContextValue, useDisabledParts } from '../../context';
import type { Component, Groups } from '../../interface';
import { GroupNames } from '../../utils';
import Dropbox from './dropbox';
import InnerFocus from './InnerFocus';
import useStyles from './style.style';

const Content = () => {
    const { styles } = useStyles();
    const { inners, currentCopy } = useContextValue();
    const groups = useMemo<Record<Groups, Component[]>>(() => {
        const map: any = {};
        if (!currentCopy) return map;
        GroupNames.forEach((name) => {
            // 初始化分组下面的子节点，如果没有就初始化一个空数组
            if (!currentCopy[name]) currentCopy[name] = [];
            map[name] = currentCopy[name];
        });
        return map;
    }, [currentCopy]);
    const disabled = useDisabledParts().content;
    if (!currentCopy) return null;
    return (
        <div className={styles.container}>
            {inners?.length ? (
                <InnerFocus />
            ) : (
                <>
                    <Dropbox
                        title={'Header'}
                        container={groups.header}
                        disabled={disabled.header}
                    />

                    <Dropbox title={'Body'} container={groups.body} disabled={disabled.body} />
                    <Dropbox
                        title={'Footer'}
                        container={groups.footer}
                        disabled={disabled.footer}
                    />
                </>
            )}
        </div>
    );
};

export default Content;
