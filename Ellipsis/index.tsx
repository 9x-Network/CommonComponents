import { Popover } from 'antd';
import type { CSSProperties, MouseEventHandler } from 'react';
import React from 'react';

export type EllipsisProps = {
    /**
     * 显示的最大行数
     */
    line?: number;
    /**
     * 最大显示宽度，超出自动剪切
     * 设置后line属性失效
     */
    width?: number | string;
    /**
     * 移动到文本是否展示完整内容的提示
     */
    tooltip?: boolean;
    style?: CSSProperties;
    className?: string;
    onClick?: MouseEventHandler;
    zIndex?: number;
    children?: React.ReactNode;
};

const Ellipsis = (props: EllipsisProps) => {
    const { style, className, children, onClick, line, width, tooltip, zIndex = 10 } = props;
    const ellipsisStyle: CSSProperties = width
        ? {
              display: 'block',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              width,
              textOverflow: 'ellipsis',
          }
        : {
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              boxOrient: 'vertical',
              overflow: 'hidden',
              wordBreak: 'break-all',
              WebkitLineClamp: line,
          };
    const content = (
        <div
            className={className}
            onClick={onClick}
            style={{
                ...style,
                ...ellipsisStyle,
            }}
        >
            {children}
        </div>
    );

    return tooltip ? (
        <Popover content={children} zIndex={zIndex}>
            {content}
        </Popover>
    ) : (
        content
    );
};

export default Ellipsis;
