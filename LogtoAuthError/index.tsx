import { useIntl } from '@umijs/max';
import type { ResultProps } from 'antd';
import { Button, Result, Typography } from 'antd';
import React from 'react';

export type LogtoAuthErrorProps = {
    error?: unknown;
    reason?: 'signIn' | 'unbound';
    title?: React.ReactNode;
    subTitle?: React.ReactNode;
    onRetry?: () => void;
    onBackToLogin?: () => void;
    retryText?: string;
    backToLoginText?: string;
    showErrorDetail?: boolean;
    status?: ResultProps['status'];
    extra?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

export function resolveAuthErrorMessage(error: unknown): string {
    if (!error) return '';
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    const value = error as Record<string, any>;
    return (
        value.message ||
        value.error_description ||
        value.error ||
        value.data?.message ||
        value.data?.error_description ||
        value.data?.error ||
        ''
    );
}

const LogtoAuthError: React.FC<LogtoAuthErrorProps> = (props) => {
    const {
        error,
        reason = 'signIn',
        title,
        subTitle,
        onRetry,
        onBackToLogin,
        retryText,
        backToLoginText,
        showErrorDetail = true,
        status = 'error',
        extra,
        className,
        style,
    } = props;
    const { formatMessage } = useIntl();
    const detail = resolveAuthErrorMessage(error);
    const isUnbound = reason === 'unbound';
    const titleId = isUnbound
        ? 'components.logtoAuthError.unboundTitle'
        : 'components.logtoAuthError.title';
    const subTitleId = isUnbound
        ? 'components.logtoAuthError.unboundSubTitle'
        : 'components.logtoAuthError.subTitle';
    const backToLoginId = isUnbound
        ? 'components.logtoAuthError.signOut'
        : 'components.logtoAuthError.backToLogin';

    const actions: React.ReactNode[] = [];
    if (onRetry) {
        actions.push(
            <Button key="retry" type="primary" onClick={onRetry}>
                {retryText ?? formatMessage({ id: 'components.logtoAuthError.retry' })}
            </Button>,
        );
    }
    if (onBackToLogin) {
        actions.push(
            <Button key="backToLogin" onClick={onBackToLogin}>
                {backToLoginText ?? formatMessage({ id: backToLoginId })}
            </Button>,
        );
    }
    if (extra) {
        actions.push(<React.Fragment key="extra">{extra}</React.Fragment>);
    }

    return (
        <div className={className} style={{ padding: 48, ...style }}>
            <Result
                status={status}
                title={title ?? formatMessage({ id: titleId })}
                subTitle={subTitle ?? formatMessage({ id: subTitleId })}
                extra={actions.length ? actions : undefined}
            >
                {showErrorDetail && detail ? (
                    <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
                        {formatMessage(
                            { id: 'components.logtoAuthError.detail' },
                            { message: detail },
                        )}
                    </Typography.Paragraph>
                ) : null}
            </Result>
        </div>
    );
};

export default LogtoAuthError;
