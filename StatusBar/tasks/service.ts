import request from '@/utils/request';

export interface Task {
    create_time: string;
    platform_type: number;
    status: number;
    task_id: number;
    task_name: string;
    task_type: number;
    description?: string;
    end_time?: string;
    file_url?: string;
    start_time?: string;
    update_time?: string;
    progress?: string;
}

// 获取任务列表
export async function getTasks(params?: any): Promise<{ list: Task[]; total: number }> {
    return request.post(`bis/${AppPkgName}/task/list`, params);
}

// 清除所有已完成的任务
export async function clearCompletedTasks() {
    return request.post(`bis/${AppPkgName}/task/remove`);
}
