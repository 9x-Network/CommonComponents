import type { InternalNamePath, Rule } from 'rc-field-form/lib/interface';
import type React from 'react';

export interface Validator {
    name: string;
    label: string;
    multiple?: boolean;
    initializeData: () => Partial<Rule>;
    render: (
        rules: Rule[],
        info: {
            index: number;
            path: InternalNamePath;
        },
    ) => React.ReactNode;
}
