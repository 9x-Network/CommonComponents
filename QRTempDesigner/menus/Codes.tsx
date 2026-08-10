import { CodeOutlined } from '@ant-design/icons';
import { Popover } from 'antd';

const Codes = ['merchant_no', 'merchant_name', 'store_no', 'store_name'];

const Fill = () => {
    return (
        <Popover
            trigger={['click']}
            content={
                <div>
                    {Codes.map((item) => (
                        <div key={item} className={'text-primary'}>
                            {'{'}
                            {item}
                            {'}'}
                        </div>
                    ))}
                </div>
            }
        >
            <div className={'drawingpad-menu_act'}>
                <CodeOutlined />
            </div>
        </Popover>
    );
};

export default Fill;
