import MultipleLangInput from '../MultipleLangInput';

export interface MessageInputProps {
    value?: string | Record<string, string>;
    onChange?: (value?: string | Record<string, string>) => void;
}

function isEmpty(val: any): boolean {
    if (val === '') return true;
    return typeof val === 'object' && Object.keys(val).length === 0;
}

const MessageInput = (props: MessageInputProps) => {
    const { value, onChange } = props;
    return (
        <MultipleLangInput
            value={value}
            onChange={(v: any) => {
                onChange?.(isEmpty(v) ? undefined : v);
            }}
        />
    );
};

export default MessageInput;
