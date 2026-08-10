import { ProFormDateRangePicker, ProFormText } from '@ant-design/pro-form';
import { DatePicker } from 'antd';
import React from 'react';
import type { Component } from '../index';

class DateRangePicker implements Component {
    name = 'Date Range Picker';
    type = 'DateRangePicker';
    validators = ['required'];

    renderThumb(): React.ReactNode {
        return <DatePicker.RangePicker style={{ width: '100%' }} />;
    }

    renderInitialValueField(): React.ReactNode {
        function Wrapper(props: any) {
            return <ProFormDateRangePicker fieldProps={props} />;
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

export default DateRangePicker;
