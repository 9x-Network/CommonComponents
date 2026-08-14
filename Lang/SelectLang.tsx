import { GlobalOutlined } from '@ant-design/icons';
import { SelectLang as UmiSelectLang } from '@umijs/max';

export type SelectLangProps = Parameters<typeof UmiSelectLang>[0];
const SelectLang = (props: SelectLangProps) => {
    const { icon = <GlobalOutlined />, ...rest } = props;
    return <UmiSelectLang icon={icon} {...rest} />;
};

export default SelectLang;
