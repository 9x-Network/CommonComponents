import { PageContainer, PageContainerProps } from '@ant-design/pro-components';
import { useMemo } from 'react';
import useStyles from './index.styles';

export interface RuPageContainerProps extends Omit<PageContainerProps, 'breadcrumbRender'> {
    breadcrumbRender?: PageContainerProps['breadcrumbRender'] | boolean;
}

const RuPageContainer = (props: RuPageContainerProps) => {
    const {
        onBack = () => {
            history.back();
        },
        backIcon,
        breadcrumbRender = false,
        ghost = false,
        header,
        ...rest
    } = props;
    const { styles } = useStyles({
        hasTabs: !!rest.tabList?.length,
    });
    const breadcrumbRenderProp = useMemo(() => {
        if (breadcrumbRender === true) return undefined;
        return breadcrumbRender;
    }, [breadcrumbRender]);

    return (
        <PageContainer
            className={styles.container}
            backIcon={backIcon}
            onBack={onBack}
            breadcrumbRender={breadcrumbRenderProp}
            header={{
                ghost,
                ...header,
            }}
            ghost={ghost}
            {...rest}
        />
    );
};

export default RuPageContainer;
