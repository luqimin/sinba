/**
 * 定时任务
 */

import * as schedule from 'node-schedule';

/**
 * 定时任务存储
 */
export const ScheduleStorage: Map<symbol, schedule.Job> = new Map();
export const IntervalStorage: Map<symbol, NodeJS.Timer> = new Map();
export const TimeoutStorage: Map<symbol, NodeJS.Timer> = new Map();

export class Schedule {
    /**
     * schedule实例
     */
    private _job: schedule.Job;

    /**
     * schedule实例id
     */
    private _id: symbol;

    constructor(rule: string, cb: () => any) {
        this._job = schedule.scheduleJob(rule, cb);
        this._id = Symbol('sinba.schedule');
        ScheduleStorage.set(this._id, this._job);
    }

    /**
     * 取消定时任务
     */
    public cancel(): void {
        this._job.cancel();
        ScheduleStorage.delete(this._id);
    }
}

export class Interval {
    /**
     * Interval实例
     */
    private _job: NodeJS.Timer;

    /**
     * Interval实例id
     */
    private _id: symbol;
    constructor(callback: (...args: any[]) => void, ms: number, ...args: any[]) {
        this._job = setInterval(callback, ms, ...args);
        this._id = Symbol('sinba.interval');
        IntervalStorage.set(this._id, this._job);
    }
    public cancel(): void {
        clearInterval(this._job);
        ScheduleStorage.delete(this._id);
    }
}

export class Timeout {
    /**
     * Timeout实例
     */
    private _job: NodeJS.Timer;

    /**
     * Timeout实例id
     */
    private _id: symbol;
    constructor(callback: (...args: any[]) => void, ms: number, ...args: any[]) {
        this._job = setInterval(callback, ms, ...args);
        this._id = Symbol('sinba.timeout');
        TimeoutStorage.set(this._id, this._job);
    }
    public cancel(): void {
        clearTimeout(this._job);
        ScheduleStorage.delete(this._id);
    }
}

export class SinbaSchedule {
    /**
     * 新增定时任务
     */
    public creatSchedule(rule: string, cb: () => any): Schedule {
        return new Schedule(rule, cb);
    }

    /**
     * 新增interval任务
     */
    public creatInterval(callback: (...args: any[]) => void, ms: number, ...args: any[]) {
        return new Interval(callback, ms, ...args);
    }

    /**
     * 新增timeout任务
     */
    public creatTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]) {
        return new Timeout(callback, ms, ...args);
    }

    /**
     * 清空所有定时任务
     */
    public cancelAll(): void {
        for (const sche of ScheduleStorage) {
            sche[1].cancel();
            ScheduleStorage.delete(sche[0]);
        }
        if (IntervalStorage.size) {
            setTimeout(() => {
                for (const sche of IntervalStorage) {
                    clearInterval(sche[1]);
                    ScheduleStorage.delete(sche[0]);
                }
            }, 1000);
        }
        if (TimeoutStorage.size) {
            setTimeout(() => {
                for (const sche of TimeoutStorage) {
                    clearTimeout(sche[1]);
                    ScheduleStorage.delete(sche[0]);
                }
            }, 1000);
        }
    }
}
