import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { useMemo } from 'react';
import { useContextValue } from '../../context';
import type { Component } from '../../interface';
import Dropbox from './dropbox';
import useStyles from './style.style';

const InnerFocus = () => {
    const { styles } = useStyles();
    const { inners, setInners, setSelectedComponent } = useContextValue();
    const focus = useMemo<Component | null>(() => {
        if (!inners?.length) return null;
        return inners[inners.length - 1];
    }, [inners]);
    const components = useMemo(() => {
        if (!focus) return null;
        if (!focus.children) focus.children = [];
        return focus.children as Component[];
    }, [focus]);
    const back = (index: number) => {
        if (index === inners?.length) return;
        setSelectedComponent(index === 0 ? undefined : focus?.id);
        setInners(inners!.slice(0, index));
    };

    if (!focus || !components) return null;
    return (
        <Dropbox
            className={styles.innerFocus}
            title={
                <Breadcrumb separator={'>'} className={'breadcrumb'}>
                    <Breadcrumb.Item key={'home'} onClick={() => back(0)}>
                        <HomeOutlined />
                    </Breadcrumb.Item>
                    {inners?.map((item, index) => (
                        <Breadcrumb.Item key={item.id} onClick={() => back(index + 1)}>
                            {item.type}
                        </Breadcrumb.Item>
                    ))}
                </Breadcrumb>
            }
            container={components}
        />
    );
};

export default InnerFocus;
