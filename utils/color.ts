/* eslint-disable no-bitwise */

/**
 * Normalize a color string to hex format (#rrggbb).
 * Supports hex and rgb/rgba input.
 */
export function normalizeColorToHex(color?: string | null): string | undefined {
    if (color == null || typeof color !== 'string') return undefined;
    const trimmed = color.trim();
    if (!trimmed) return undefined;

    if (trimmed.startsWith('#')) {
        return trimmed;
    }

    const rgbMatch = trimmed.match(
        /^rgba?\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})/i,
    );
    if (rgbMatch) {
        const r = Math.min(255, parseInt(rgbMatch[1], 10));
        const g = Math.min(255, parseInt(rgbMatch[2], 10));
        const b = Math.min(255, parseInt(rgbMatch[3], 10));
        return `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
    }

    return trimmed;
}

/**
 * 根据字符串生成颜色
 * @param str
 */
export function genColorByString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return `#${'00000'.substring(0, 6 - c.length)}${c}`;
}

/**
 * 获取反色
 * @param color
 */
export function getReverseColor(color: string): string {
    const oldColor = `0x${color.replace(/#/g, '')}` as any;
    const rstr = `000000${(0xffffff - oldColor).toString(16)}`;
    return `#${rstr.substring(rstr.length - 6, rstr.length)}`;
}

/**
 * 判断颜色是否深色
 * @param color
 * @param hspDivide
 */
export function isDarkColor(color: string, hspDivide: number = 200): boolean {
    let r: any;
    let g: any;
    let b: any;
    if (color.match(/^rgb/)) {
        const mcolor = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        if (mcolor) {
            [r, g, b] = mcolor;
        }
    } else {
        // If RGB --> Convert it to HEX: http://gist.github.com/983661
        const hexColor = +`0x${color.slice(1).replace(color.length < 5 ? /./g : '', '$&$&')}`;
        r = hexColor >> 16;
        g = (hexColor >> 8) & 255;
        b = hexColor & 255;
    }
    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
    // Using the HSP value, determine whether the color is light or dark
    return hsp < hspDivide;
}
