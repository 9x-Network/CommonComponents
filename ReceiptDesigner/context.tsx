import React from 'react';
import type { ContextType, Groups } from './interface';

export const DesignerContext = React.createContext<ContextType>({} as ContextType);

export function useContextValue() {
    return React.useContext(DesignerContext);
}

type DisabledPartsResult = {
    copy: boolean;
    library: boolean;
    content: Record<Groups, boolean>;
    property: boolean;
    toolbar: boolean;
};
export function useDisabledParts(): DisabledPartsResult {
    const { disabled } = useContextValue();
    function createSimpleResult(bool: boolean): DisabledPartsResult {
        return {
            copy: bool,
            library: bool,
            property: bool,
            toolbar: bool,
            content: {
                header: bool,
                body: bool,
                footer: bool,
            },
        };
    }
    function getContentDisabled(
        disabledContent: boolean | Groups[] | undefined,
        name: Groups,
    ): boolean {
        if (disabledContent == null) return false;
        if (typeof disabledContent === 'boolean') return disabledContent;
        if (!disabledContent.length) return false;
        return disabledContent.includes(name);
    }

    if (disabled == null) return createSimpleResult(false);
    if (typeof disabled === 'boolean') return createSimpleResult(disabled);
    return {
        copy: disabled.copy === true,
        library: disabled.library === true,
        property: disabled.property === true,
        toolbar: disabled.toolbar === true,
        content: {
            header: getContentDisabled(disabled.content, 'header'),
            body: getContentDisabled(disabled.content, 'body'),
            footer: getContentDisabled(disabled.content, 'footer'),
        },
    };
}
