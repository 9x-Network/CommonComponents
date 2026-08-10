import { getValueFromLocaleJSON } from '@/utils/utils';
import type { TemplateConfig } from './FormItem';

export const internationalFields = ['label', 'placeholder', 'extra', 'help'];

export const extendInternationalFields = (template: Partial<TemplateConfig>) => {
    internationalFields.forEach((key) => {
        if (template[key] && typeof template[key] === 'object') {
            template[key] = getValueFromLocaleJSON(template[key], '');
        }
    });
    template?.rules?.forEach((rule) => {
        if (typeof rule === 'object' && rule.message && typeof rule.message === 'object') {
            rule.message = getValueFromLocaleJSON(rule.message, '');
        }
    });
    template.options?.forEach((opt) => {
        if (typeof opt !== 'string' && opt.label && typeof opt.label === 'object') {
            opt.label = getValueFromLocaleJSON(opt.label, '');
        }
    });
    return template;
};
