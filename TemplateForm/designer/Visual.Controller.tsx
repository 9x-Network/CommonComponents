import ProForm, { ProFormSwitch, ProFormText } from '@ant-design/pro-form';
import assign from 'lodash/assign';
import debounce from 'lodash/debounce';
import React, { useEffect, useMemo } from 'react';
import { ComponentMap } from './components';
import { useDesignerContext } from './context';
import MultipleLangInput from './MultipleLangInput';
import useStyles from './style.style';
import Validators from './validators';

/**
 * 将空值转换成undefined
 * 因为有的表单属性在修改删除后需要移除该字段
 * @param obj
 */
function emptyPropertiesToUndefined(obj: object) {
    if (!obj) return;
    const ignoreList = ['label', 'placeholder', 'initialValue', 'responseListKey'];
    Object.keys(obj).forEach((key) => {
        const value = obj[key];
        if (ignoreList.includes(key)) return;
        if (value === '') {
            obj[key] = undefined;
        } else if (typeof value === 'object') {
            emptyPropertiesToUndefined(value);
        }
    });
}

const VisualController = () => {
    const { styles } = useStyles();
    const {
        value,
        setValue,
        selected,
        setSelected,
        controlForm: form,
        workForm,
    } = useDesignerContext();

    const currentField = useMemo(() => {
        if (!selected || !value?.length) return null;
        return value.find((n: any) => n.name === selected);
    }, [selected]);

    const onValuesChange = debounce((changed) => {
        const hasError = form.getFieldsError().find((n) => n.errors.length > 0);
        if (hasError) return;
        const values = form.getFieldsValue();
        const nameChanged = 'name' in changed;
        emptyPropertiesToUndefined(values);
        // 为了性能延迟同步表单数据，可能造成还未出发同步就选择了另一个组件，这里判断一下，如果组件名称对不上说明发生了变化，就不执行数据同步
        if (!nameChanged && values.name !== currentField!.name) return;
        assign(currentField, values);
        setValue(value ? [...value] : value);
        if (nameChanged) {
            setSelected(changed.name);
        }
        // 如果初始值发生变化，表单不会立即渲染，这里调用reset来使其立即显示为变更后的initialValue
        if ('initialValue' in changed) {
            workForm.resetFields([selected!]);
        }
    }, 500);

    useEffect(() => {
        form.resetFields();
        if (currentField) form.setFieldsValue(currentField);
    }, [currentField]);

    const component = useMemo(() => {
        return currentField ? ComponentMap[currentField!.type!] : null;
    }, [currentField]);

    const initialValueField = useMemo(() => {
        if (!component) return null;
        if (!component.renderInitialValueField) {
            return <ProFormText name={'initialValue'} label={'Initial Value'} />;
        }
        const rs: any = component.renderInitialValueField(currentField);
        if (!rs) return rs;
        if (React.isValidElement(rs)) {
            return (
                <ProForm.Item name={'initialValue'} label={'Initial Value'}>
                    {rs}
                </ProForm.Item>
            );
        }
        return (
            <ProForm.Item {...rs.formItemProps} name={'initialValue'} label={'Initial Value'}>
                {rs.node}
            </ProForm.Item>
        );
    }, [component, value]);

    if (!component) return null;
    return (
        <div className={styles.controller}>
            <ProForm
                form={form}
                onValuesChange={onValuesChange}
                submitter={false}
                className={'innerContent'}
                component={'div'}
            >
                <ProFormText
                    width={'sm'}
                    name={'name'}
                    label={'Name (Unique key)'}
                    rules={[{ required: true }]}
                    allowClear={false}
                />

                <ProForm.Item name={'label'} label={'Label'}>
                    <MultipleLangInput />
                </ProForm.Item>
                <ProForm.Item name={'placeholder'} label={'Placeholder'}>
                    <MultipleLangInput />
                </ProForm.Item>
                {initialValueField}
                <ProForm.Item name={'extra'} label={'Extra'}>
                    <MultipleLangInput />
                </ProForm.Item>
                <ProForm.Item name={'help'} label={'Help'}>
                    <MultipleLangInput />
                </ProForm.Item>
                <ProForm.Group>
                    <ProFormSwitch name={'disabled'} label={'Disabled'} />
                    <ProFormSwitch name={'readonly'} label={'Readonly'} />
                    <ProFormSwitch name={'allowClear'} label={'AllowClear'} initialValue={true} />
                </ProForm.Group>
                {component.renderCustomFields()}
                <ProForm.Group title={'Validators'}>
                    <ProForm.Item name={'rules'}>
                        <Validators rules={component.validators} />
                    </ProForm.Item>
                </ProForm.Group>
            </ProForm>
        </div>
    );
};

export default VisualController;
