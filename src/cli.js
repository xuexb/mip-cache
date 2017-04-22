/**
 * @file MIP缓存删除 - cli
 * @author xuexb <fe.xiaowu@gmail.com>
 */

import program from 'commander';
import ora from 'ora';
import clc from 'cli-color';
import MipCache from './';
import pkg from '../package';

const error = clc.red.bold;
const success = clc.green;

// 设置命令行工具
program
    .version(pkg.version)
    .usage('[options] <url>')
    .option('--authkey <authkey>', '配置authkey')
    .parse(process.argv);

if (!program.authkey) {
    console.log(error('authkey必须设置, 请使用: mip-cache --authkey <authkey> <url>'));
    process.exit(1);
}

if (!program.args.length) {
    console.log(error('url不能为空'));
    process.exit(1);
}

const spinner = ora('请求中...').start();
const app = new MipCache({
    authkey: program.authkey
});

app.clear(program.args[0]).then(res => {
    spinner.stop();
    console.log(success(JSON.stringify(res, null, 4)));
}, err => {
    spinner.stop();
    console.log(error(JSON.stringify(err, null, 4)));
});
