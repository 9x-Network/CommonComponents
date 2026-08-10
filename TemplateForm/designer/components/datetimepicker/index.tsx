import { ProFormText } from '@ant-design/pro-form';
import { DatePicker } from 'antd';
import moment from 'moment';
import React from 'react';
import type { Component } from '../index';

const now = moment();

class DateTimePicker implements Component {
    name = 'Datetime Picker';
    type = 'DateTimePicker';
    validators = ['required'];

    renderThumb(): React.ReactNode {
        return <DatePicker value={now} showTime style={{ width: '100%' }} />;
    }

    renderInitialValueField(): React.ReactNode {
        function Wrapper(props: any) {
            const { value, ...rest } = props;
            return <DatePicker showTime value={moment(value)} {...rest} />;
        }

        return <Wrapper showTime />;
    }

    renderCustomFields(): React.ReactNode {
        return (
            <>
                <ProFormText name={['fieldProps', 'format']} label={'Formatter'} />
            </>
        );
    }
}

export default DateTimePicker;
