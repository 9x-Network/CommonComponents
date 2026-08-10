import { ProFormText } from '@ant-design/pro-form';
import { DatePicker as AntDatePicker } from 'antd';
import moment from 'moment';
import React from 'react';
import type { Component } from '../index';

const now = moment();

class DatePicker implements Component {
    name = 'Date Picker';
    type = 'DatePicker';
    validators = ['required'];

    renderThumb(): React.ReactNode {
        return <AntDatePicker value={now} style={{ width: '100%' }} />;
    }

    renderInitialValueField(): React.ReactNode {
        function Wrapper(props: any) {
            const { value, ...rest } = props;
            return <AntDatePicker value={moment(value)} {...rest} />;
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

export default DatePicker;
