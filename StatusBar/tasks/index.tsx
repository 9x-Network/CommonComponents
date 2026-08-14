import type { BaseWidgetProps } from '@/components/App/HeaderRightContent/StatusBar/widgets';
import DateFormatter from '@/components/Formatter/DateFormatter';
import { getRemoteFile } from '@/services/basis';
import { getPublicPath, getValueFromLocaleJSON } from '@/utils/utils';
import { ClearOutlined, InfoCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { getIntl, useRequest } from '@umijs/max';
import { Alert, Avatar, Badge, Card, List, message, Modal, Popover, Tag, Tooltip } from 'antd';
import type { PropsWithChildren } from 'react';
import { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import useStyles from './index.style';
import type { Task } from './service';
import { clearCompletedTasks, getTasks } from './service';

const { formatMessage } = getIntl();

export interface TasksProps extends BaseWidgetProps {
    refreshFrequency: number;
}

export type TaskRef = {
    /**
     * 获取或设置是否展开属性
     */
    visible: (visible?: boolean) => boolean | void;
    /**
     * 重新加载列表
     */
    reload: () => void;
    /**
     * 刷新列表
     */
    refresh: () => void;
    /**
     * 设置标记小红点
     */
    dot: (dot: boolean) => void;
    /**
     * 任务栏通知
     */
    notify: (opts?: {
        tip?: string | false;
        reload?: boolean;
        dot?: boolean;
    }) => Promise<{ list: Task[]; total: number }> | void;
};

export const TaskTypes: Record<string, any> = {
    1: {
        text: formatMessage({
            id: 'components.StatusBar.widgets.task.type.import',
        }),
        icon: getPublicPath('imgs/icon-task_import.png'),
    },
    2: {
        text: formatMessage({
            id: 'components.StatusBar.widgets.task.type.export',
        }),
        icon: getPublicPath('imgs/icon-task_export.png'),
    },
    3: {
        text: formatMessage({
            id: 'components.StatusBar.widgets.task.type.timing',
        }),
        icon: getPublicPath('imgs/icon-timing_import.png'),
    },
    4: {
        text: formatMessage({ id: 'components.StatusBar.widgets.task.type.other' }),
        icon: getPublicPath('imgs/icon-other_import.png'),
    },
};

export const TaskStatus: Record<string, any> = {
    0: {
        text: formatMessage({
            id: 'components.StatusBar.widgets.task.status.exec',
        }),
        color: 'blue',
    },
    1: {
        text: formatMessage({
            id: 'components.StatusBar.widgets.task.status.successful',
        }),
        color: 'green',
    },
    2: {
        text: formatMessage({
            id: 'components.StatusBar.widgets.task.status.failed',
        }),
        color: 'red',
    },
};

let tipTimeout: NodeJS.Timeout;

const Tasks = (props: PropsWithChildren<TasksProps>) => {
    const { styles } = useStyles();
    const { children, compRef, menu, refreshFrequency = 3000 } = props;
    const [visible, setVisible] = useState<boolean>(false);
    const [dot, setDot] = useState<boolean>(false);
    const [tip, setTip] = useState<string>();
    const calledOnce = useRef<boolean>(false);
    const { data, error, loading, pagination, run, refresh, cancel } = useRequest<Task>(
        (params) => getTasks({ page_num: params.current, page_size: params.pageSize }),
        {
            manual: true,
            paginated: true,
            pollingInterval: refreshFrequency,
            pollingWhenHidden: false,
        },
    );
    const reload = () => run({ current: 1, pageSize: 20 });

    useEffect(() => {
        if (visible) {
            setTip(undefined);
            setDot(false);
            const fn = calledOnce.current ? refresh : reload;
            fn();
            calledOnce.current = true;
        } else if (calledOnce.current) {
            cancel();
        }
    }, [visible]);

    useImperativeHandle<any, TaskRef>(
        compRef,
        () => ({
            visible: (flag) => {
                if (flag === undefined) {
                    return visible;
                }
                setVisible(flag);
                return undefined;
            },
            reload,
            refresh,
            dot: (d) => setDot(d),
            notify: (opts = {}) => {
                const { reload: needReload = true, tip: tipOpt = true, dot: dotOpt = true } = opts;
                if (tipOpt) {
                    const msg =
                        typeof tipOpt === 'string'
                            ? tipOpt
                            : formatMessage({ id: 'components.StatusBar.widgets.task.tip' });
                    setTip(msg);
                    if (tipTimeout) clearTimeout(tipTimeout);
                    tipTimeout = setTimeout(() => {
                        setTip(undefined);
                    }, 3000);
                }
                setDot(dotOpt);
                return needReload ? reload() : undefined;
            },
        }),
        [],
    );
    const clear = () => {
        Modal.confirm({
            title: formatMessage({
                id: 'components.StatusBar.widgets.task.clear.confirm',
            }),
            zIndex: 9999,
            onOk: () => {
                return clearCompletedTasks().then(
                    () => {
                        message.success(formatMessage({ id: 'common.operateSuccess' }));
                        reload();
                    },
                    (err) => {
                        message.error(err.message);
                    },
                );
            },
        });
    };

    const menuName = useMemo(() => getValueFromLocaleJSON(menu.name), [menu]);
    return (
        <Popover
            overlayClassName={styles.overlay}
            trigger={['click']}
            open={visible}
            onOpenChange={setVisible}
            content={() => (
                <Card
                    className={styles.card}
                    title={
                        <>
                            <span>{menuName}</span>
                            <span className={styles.tip}>
                                <InfoCircleOutlined />
                                {formatMessage({
                                    id: 'components.StatusBar.widgets.task.status.tip',
                                })}
                            </span>
                        </>
                    }
                    extra={
                        <div className={styles.actions}>
                            <a
                                title={formatMessage({
                                    id: 'components.StatusBar.widgets.task.clear',
                                })}
                                onClick={clear}
                            >
                                <ClearOutlined className={'text-danger'} />
                            </a>
                            <a
                                title={formatMessage({
                                    id: 'components.StatusBar.widgets.task.reload',
                                })}
                                onClick={() => {
                                    if (loading) return;
                                    reload();
                                }}
                            >
                                <ReloadOutlined spin={loading} className={'text-link'} />
                            </a>
                        </div>
                    }
                >
                    {error && <Alert message={error.message} type={'error'} showIcon />}
                    <List
                        className={styles.list}
                        dataSource={data?.list}
                        pagination={{
                            ...(pagination as any),
                            size: 'small',
                            showSizeChanger: true,
                            showQuickJumper: true,
                        }}
                        renderItem={(item) => (
                            <List.Item
                                key={item.task_id}
                                className={`${styles.listItem} ${
                                    item.file_url ? styles.clickable : ''
                                }`}
                                onClick={() => {
                                    if (item.file_url) {
                                        window.open(getRemoteFile(item.file_url));
                                    }
                                }}
                            >
                                <List.Item.Meta
                                    style={{ alignItems: 'center' }}
                                    avatar={<Avatar src={TaskTypes[item.task_type]?.icon} />}
                                    title={item.task_name}
                                    description={<DateFormatter value={item.create_time} />}
                                />

                                <div>
                                    <Tag color={TaskStatus[item.status]?.color}>
                                        {item.status == 0
                                            ? `${parseInt(item.progress || '0') || 0}%`
                                            : TaskStatus[item.status]?.text}
                                    </Tag>
                                </div>
                            </List.Item>
                        )}
                    />
                </Card>
            )}
        >
            <Tooltip
                title={tip}
                open={!!tip}
                placement={'bottomRight'}
                styles={{ root: { maxWidth: '100%' } }}
                arrow={{ pointAtCenter: true }}
            >
                <Badge dot={dot}>{children}</Badge>
            </Tooltip>
        </Popover>
    );
};

export default Tasks;
