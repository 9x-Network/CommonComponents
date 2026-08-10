import merge from 'lodash/merge';
import { useMemo } from 'react';
import { getComponentDeclare } from '../../components';
import { useContextValue, useDisabledParts } from '../../context';
import useStyles from './style.style';

const Properties = () => {
    const { styles } = useStyles();
    const { currentComponent, update } = useContextValue();
    const disabled = useDisabledParts().property;

    const control = useMemo(() => {
        if (!currentComponent) return null;
        const { Property, name } = getComponentDeclare(currentComponent.type)!;
        const onValuesChange = (values: any) => {
            merge(currentComponent, values);
            update();
        };
        return {
            name,
            children: (
                <Property
                    key={currentComponent.id}
                    component={currentComponent as any}
                    onValuesChange={onValuesChange}
                />
            ),
        };
    }, [currentComponent]);
    return (
        <div className={styles.container}>
            {currentComponent && (
                <div className={styles.type}>
                    {control?.name}: {currentComponent.id}
                </div>
            )}
            <div>{control?.children}</div>
            {disabled && <div className={styles.disabledMask} />}
        </div>
    );
};

export default Properties;
