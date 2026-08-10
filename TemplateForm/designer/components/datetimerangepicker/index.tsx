import { ProFormDateTimeRangePicker, ProFormText } from '@ant-design/pro-form';
import { DatePicker } from 'antd';
import React from 'react';
import type { Component } from '../index';

class DateTimeRangePicker implements Component {
    name = 'Datetime Range Picker';
    type = 'DateTimeRangePicker';
    validators = ['required'];

    renderThumb(): React.ReactNode {
        return <DatePicker.RangePicker showTime style={{ width: '100%' }} />;
    }

    renderInitialValueField(): React.ReactNode {
        function Wrapper(props: any) {
            return <ProFormDateTimeRangePicker fieldProps={props} />;
        }

        return <Wrapper />;
    }

    renderCustomFields(): React.ReactNode {
        return (
            <>
                <ProFormText name={['fieldProps', 'format']} label={'Formatter'} />
            </>
        );
    }
}

export default DateTimeRangePicker;
