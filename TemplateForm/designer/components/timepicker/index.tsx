import { ProFormText } from '@ant-design/pro-form';
import { TimePicker as AntTimePicker } from 'antd';
import moment from 'moment';
import React from 'react';
import type { Component } from '../index';

const now = moment();

class TimePicker implements Component {
    name = 'Time Picker';
    type = 'TimePicker';
    validators = ['required'];

    renderThumb(): React.ReactNode {
        return <AntTimePicker value={now as any} style={{ width: '100%' }} />;
    }

    renderInitialValueField(): React.ReactNode {
        return <AntTimePicker />;
    }

    renderCustomFields(): React.ReactNode {
        return (
            <>
                <ProFormText name={['fieldProps', 'format']} label={'Formatter'} />
            </>
        );
    }
}

export default TimePicker;
