import { useDisabledParts } from '@/components/common/ReceiptDesigner/context';
import React from 'react';
import menuList from './menus';
import useStyles from './style.style';

export type ToolbarConfig = {
    menus?: string[];
    extra?: React.ReactNode;
    title?: React.ReactNode;
    lang?: string;
};
export interface ToolbarProps {
    config?: ToolbarConfig;
}
const Toolbar = (props: ToolbarProps) => {
    const { styles } = useStyles();
    const { config = {} } = props;
    const {
        menus = ['fontFamily', 'fontScale', 'xmlView', 'import', 'export'],
        title = <b>Receipt Designer</b>,
        extra,
        lang = '',
    } = config;
    const disabled = useDisabledParts().toolbar;
    return (
        <div className={styles.toolbar}>
            <div className={'title'}>{title}</div>
            <div className={'extra'}>
                {menus.map((key) => {
                    const Menu = menuList[key];
                    if (!Menu) return null;
                    return (
                        <div key={key} className={'item'}>
                            <Menu disabled={disabled} lang={lang} />
                        </div>
                    );
                })}
                <div className={'custom'}>{extra}</div>
            </div>
        </div>
    );
};

export default Toolbar;
