/**
 * @file 测试用例
 * @author xuexb <fe.xiaowu@gmail.com>
 */

import MipCache from '../src/';
import {expect} from 'chai';

describe('mip-cache', () => {
    it('check options', () => {
        expect(() => {
            new MipCache();
        }).to.throw(/options.authkey/);

        expect(() => {
            new MipCache({
                site: '1'
            });
        }).to.throw(/options.authkey/);

        expect(() => {
            new MipCache({
                authkey: '1'
            });
        }).to.not.throw();
    });

    it('#_parseUrl', () => {
        const app = new MipCache({
            authkey: '123456'
        });

        expect(() => {
            app._parseUrl();
        }).to.throw('url is not string');

        expect(() => {
            app._parseUrl('');
        }).to.throw('url is empty');

        expect(() => {
            app._parseUrl('xuexb.com');
        }).to.not.throw();
    });
});
