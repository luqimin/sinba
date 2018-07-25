/**
 * 写入文件，使用队列缓存优化文件io性能
 */
import * as path from 'path';
import { createWriteStream, existsSync, writeFile, WriteStream, statSync, writeFileSync } from "fs";
import * as moment from 'moment';
import { Schedule, Interval } from '../schedule';
import { makeDirs, readFile } from '../utils';

export interface LogFileOptionsPath {
    /**
     * 文件详细路径
     */
    path: string;
    /**
     * logrotate
     */
    logrotate?: boolean;
}

export interface LogFileOptionsDetail {
    dirname: string;
    filename: string;
    /**
     * 是否按日期做文件分片
     */
    dateSplit?: boolean;
    /**
     * 是否按文件大小做文件分片
     */
    sizeSplit?: boolean;
    /**
     * 文件分片大小阈值
     */
    maxFileSize?: number;
    /**
     * logrotate
     */
    logrotate?: boolean;
}

export type LogFileOptions = LogFileOptionsPath | LogFileOptionsDetail;

export class FileTask {
    /**
     * 写入文件实际路径，内部需要修改文件路径使用 `this.filepath = '/path'`
     */
    private _filepath: string;

    /**
     * 文件写入流
     */
    private _stream: WriteStream | null;

    /**
     * 当前日期
     * YYYY-MM-DD
     */
    private _today: string;

    /**
     * 配置
     */
    private options: LogFileOptions;

    /**
     * 文件写入内容缓存队列
     */
    private _queue: string[];

    /**
     * 队列监听interval
     */
    private _interval: Interval | null;

    /**
     * 文件切片定时任务
     */
    private _schedule: Schedule;
    private _logrotateSchedule: Schedule;

    /**
     * 队列为空标记
     */
    private _emptyQueueCount: number = 0;

    constructor(options?: LogFileOptions) {
        if (!options) {
            return;
        }
        this.options = options;
        this._queue = [];

        const logDirname: string = 'path' in options ? path.dirname(options.path) : options.dirname;

        if (!existsSync(logDirname)) {
            makeDirs(logDirname);
        }

        // 按日期备份
        if (options.logrotate) {
            this.initLogrotate();
        }

        // 直接定义文件路径
        // if (Reflect.has(options, 'path')) {
        if ('path' in options) {
            this.filepath = options.path;
            return;
        }

        // 文件按日期分片
        if (options.dateSplit) {
            this._today = moment().format('YYYY-MM-DD');
            this.filepath = path.join(options.dirname, options.filename.replace('.', `.${this._today}.`));
            // 初始化文件切片定时任务
            this.initFileSplitSchedule();
            return;
        }

        this.filepath = path.join(options.dirname, options.filename);
    }

    /**
     * 写入文件
     */
    public write(str: string): void {
        this._queue.push(str);

        // 开始监控缓存队列
        if (!this._interval) {
            this.watchQueue();
        }
    }

    /**
     * 获取写入文件路径
     */
    private get filepath() {
        return this._filepath;
    }

    /**
     * 写入文件路径修改，内部需要修改文件路径使用 `this.filepath = '/path'`
     */
    private set filepath(value: string) {
        this._filepath = value;

        // 删除旧文件流，启用新的文件写入流
        this.closeStream();
        this.creatStream();
    }

    /**
     * 初始化队列监听
     */
    private watchQueue(): void {
        this.writeFileImmediately();
        this._interval = new Interval(() => {
            if (this._queue.length > 0) {
                this.writeFileImmediately();
            } else {
                if (this._emptyQueueCount > 10) {
                    // 如果10秒内缓存队列仍然为空，则停止监听队列
                    this._interval && this._interval.cancel();
                    this._interval = null;
                    this._emptyQueueCount = 0;
                } else {
                    this._emptyQueueCount++;
                }
            }
        }, 1000);
    }

    /**x
     * 初始化文件切片schedule
     */
    private initFileSplitSchedule() {
        // 每天00:00:10分生成一个新的文件流
        this._schedule = new Schedule('10 0 0 * * *', () => {
            // 获取当日时间，并立即写入混存日志
            const _today = moment().format('YYYY-MM-DD');
            if (this._queue.length > 0) {
                this.writeFileImmediately();
            }
            // 隔日写新文件
            this._today = _today;
            this.filepath = path.join(
                (this.options as LogFileOptionsDetail).dirname,
                (this.options as LogFileOptionsDetail).filename.replace('.', `.${_today}.`),
            );
        });
    }

    /**
     * logrotate 每天00:00:20将日志内容备份，并以日期命名
     */
    private initLogrotate() {
        // 每天00:00:20
        this._logrotateSchedule = new Schedule('20 0 0 * * *', () => {
        // this._logrotateSchedule = new Schedule('*/10 * * * * *', () => {
            // 获取当日时间，并立即写入混存日志
            const _backupDate = moment().subtract(1, 'd').format('YYYY-MM-DD');
            if (this._queue.length > 0) {
                this.writeFileImmediately();
            }

            const _logs = readFile(this.filepath);

            if (!_logs) {
                return;
            }
            const _backupFilepath = path.join(
                (this.options as LogFileOptionsDetail).dirname,
                (this.options as LogFileOptionsDetail).filename.replace('.', `.${_backupDate}.`));

            writeFile(_backupFilepath, _logs, (err) => {
                writeFileSync(this.filepath, '', 'utf8');
            });
        });
    }

    /**
     * 判断文件大小做文件切片
     */
    private fileSizeSplit() {
        if ((this.options as LogFileOptionsDetail).sizeSplit === true && existsSync(this.filepath)) {
            const fileInfo = statSync(this.filepath);
            const _maxFileSize = (this.options as LogFileOptionsDetail).maxFileSize;
            if (_maxFileSize && fileInfo.size >= _maxFileSize) {
                // 获取当日时间
                const _today = process.env.NODE_APP_INSTANCE ? `${moment().format('X')}-${process.env.NODE_APP_INSTANCE}` : moment().format('X');
                this.filepath = path.join(
                    (this.options as LogFileOptionsDetail).dirname,
                    (this.options as LogFileOptionsDetail).filename.replace(/\S*.(tp|alive|business|biz).(log)/, (val, $1, $2) => (
                        `${_today}.${$1}.${$2}`
                    )),
                );
            }
        }
    }

    /**
     * 立刻记录缓存所有日志，并清空缓存
     */
    private writeFileImmediately(): void {
        this.writeStream(this._queue.join('\n'));
        this._queue.length = 0;
    }

    /**
     * 创建文件写入流
     */
    private creatStream(): void {
        this._stream = createWriteStream(this.filepath, {
            flags: 'a',
            encoding: 'utf8',
            autoClose: false,
        });
    }

    /**
     * 往文件内写入内容
     */
    private writeStream(str: string): void {
        if (this._stream) {
            this.fileSizeSplit();
            this._stream.write(str + '\n');
        }
    }

    /**
     * 关闭文件写入流
     */
    private closeStream(): void {
        if (this._stream) {
            this._stream.end();
            this._stream = null;
        }
    }
}
