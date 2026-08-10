import { createStyles } from 'antd-style';
import React from 'react';

const useStyles = createStyles(({ token }, { hasTabs }: { hasTabs: boolean }) => {
    const pageHeaderStyle: React.CSSProperties = {
        marginBottom: token.marginMD,
    };
    if (hasTabs) {
        pageHeaderStyle.paddingBottom = 0;
    }
    return {
        container: {
            '.ant-page-header': {
                backgroundColor: token.colorBgContainer,
            },
            '.ant-tabs-top >.ant-tabs-nav': {
                marginBottom: 0,
            },
            '.ant-pro-page-container-warp-page-header': {
                ...pageHeaderStyle,
            },
        },
    };
});

export default useStyles;
