import type { TemplateConfig } from '@/components/common/TemplateForm/FormItem';
import { message } from 'antd';
import classnames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import { useEffect, useMemo } from 'react';
import { useDrop } from 'react-dnd';
import TemplateForm from '../../index';
import type { Component } from '../components';
import { useDesignerContext } from '../context';
import useStyles from '../style.style';
import DragItem from './DragItem';

const VisualWorkPlate = () => {
    const { styles } = useStyles();
    const { workForm, controlForm, disabled } = useDesignerContext();
    const { value, setValue, selected, setSelected } = useDesignerContext();

    const deleteSelected = () => {
        if (!value || !selected) return;
        const index = value?.findIndex((n) => n.name === selected);
        value.splice(index, 1);
        setValue([...value]);
        setSelected();
    };

    useEffect(() => {
        const handleKeyPress = (evt: KeyboardEvent) => {
            if (evt.key === 'Delete') {
                deleteSelected();
            }
        };
        document.addEventListener('keyup', handleKeyPress);
        return () => {
            document.removeEventListener('keyup', handleKeyPress);
        };
    }, [selected]);

    const checkControlFormHasError = async () => {
        const hasError = await controlForm.validateFields().then(
            () => false,
            () => true,
        );
        if (hasError) {
            message.error('Please check form');
        }
        return hasError;
    };

    const createInitialItem = (item: Component) => ({
        ...item.getInitialData?.(),
        type: item.type,
        name: `Name-${value?.length || 0}${Date.now()}`,
        label: `${item.type}-${value?.length || 0}`,
    });

    const [{ bodyActive }, drop] = useDrop(
        () => ({
            accept: 'component',
            canDrop: () => !disabled,
            drop: async (item: Component, monitor) => {
                if (!monitor.isOver({ shallow: true }) || (await checkControlFormHasError()))
                    return;
                const newValue = value ? [...value] : [];
                newValue.push(createInitialItem(item));
                setValue(newValue);
            },
            collect: (monitor) => ({
                bodyActive: monitor.isOver({ shallow: true }) && monitor.canDrop(),
            }),
        }),
        [value],
    );

    const onJumpDrop = async (item: Component, template: TemplateConfig) => {
        if (await checkControlFormHasError()) return;
        const newValue = [...value!];
        const index = newValue.findIndex((n) => n.name === template.name);
        newValue.splice(index, 0, createInitialItem(item));
        setValue(newValue);
    };

    const editValue = useMemo(() => cloneDeep(value), [value]);

    return (
        <div className={classnames(styles.workplate, { active: bodyActive })} ref={drop}>
            <TemplateForm
                form={workForm}
                templates={editValue}
                emptyContent={null}
                submitter={false}
                component={'div'}
                className={'innerContent'}
                onFocus={(evt) => {
                    evt.target?.blur?.();
                }}
                renderFormItem={(dom, template) => {
                    return (
                        <DragItem
                            className={classnames('formItem', {
                                selected: selected === template.name,
                            })}
                            data={template}
                            draggable={!disabled}
                            onClick={async () => {
                                if (template.name === selected) return;
                                if (await checkControlFormHasError()) return;
                                setSelected(template.name as string);
                            }}
                            onDrop={onJumpDrop}
                        >
                            {dom}
                        </DragItem>
                    );
                }}
            />
        </div>
    );
};

export default VisualWorkPlate;
