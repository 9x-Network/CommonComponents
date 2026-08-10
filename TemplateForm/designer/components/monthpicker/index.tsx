import { ProFormText } from '@ant-design/pro-form';
import { DatePicker as AntDatePicker } from 'antd';
import moment from 'moment';
import React from 'react';
import type { Component } from '../index';

const now = moment();

class MonthPicker implements Component {
    name = 'Month Picker';
    type = 'MonthPicker';
    validators = ['required'];

    renderThumb(): React.ReactNode {
        return <AntDatePicker value={now} picker={'month'} style={{ width: '100%' }} />;
    }

    renderInitialValueField(): React.ReactNode {
        function Wrapper(props: any) {
            const { value, ...rest } = props;
            return <AntDatePicker picker={'month'} value={moment(value)} {...rest} />;
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

export default MonthPicker;
