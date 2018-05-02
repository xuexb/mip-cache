/**
 * @file 测试用例
 * @author xuexb <fe.xiaowu@gmail.com>
 */

import MipCache from '../src/';
import {expect} from 'chai';
import request from 'request';
import sinon from 'sinon';

/* eslint-disable max-nested-callbacks */

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
        }).to.throw('url cannot be empty');

        expect(() => {
            app._parseUrl('');
        }).to.throw('url cannot be empty');

        expect(() => {
            app._parseUrl([]);
        }).to.throw('url should be a string');

        expect(() => {
            app._parseUrl('xuexb.com');
        }).to.not.throw();
    });

    describe('#clear', () => {
        let app;

        beforeEach(() => {
            app = new MipCache({
                authkey: '123456'
            });
        });

        afterEach(() => {
            if ('function' === typeof request.post.restore) {
                request.post.restore();
            }
        });

        it('server error', () => {
            sinon.stub(request, 'post').yields('error');

            return app.clear('http://xuexb.com').catch(err => {
                expect(err).to.deep.equal({
                    status: -1,
                    msg: 'error'
                });
            });
        });

        it('parse json error', () => {
            sinon.stub(request, 'post').yields(null, '', '{');

            return app.clear('http://xuexb.com').catch(err => {
                expect(err).to.deep.equal({
                    status: -2,
                    msg: 'parse json error'
                });
            });
        });

        it('data error', () => {
            sinon.stub(request, 'post').yields(null, '', JSON.stringify({
                status: 1
            }));

            return app.clear('http://xuexb.com').catch(err => {
                expect(err).to.deep.equal({
                    status: 1,
                    msg: 'server code error'
                });
            });
        });

        it('zhanzhang data error', () => {
            return app.clear('http://xuexb.com').catch(err => {
                expect(err).to.deep.equal({
                    status: 1,
                    msg: 'auth check fail'
                });
            });
        });

        it('https', () => {
            return app.clear('https://mip.xuexb.com').catch(err => {
                expect(err).to.deep.equal({
                    status: 1,
                    msg: 'auth check fail'
                });
            });
        });
    });

    if (process.env.MIP_CACHE_AUTHKEY) {
        it('https', () => {
            return new MipCache({
                authkey: process.env.MIP_CACHE_AUTHKEY
            }).clear('https://mip.xuexb.com').then(data => {
                expect(data).to.deep.equal({
                    status: 0,
                    msg: 'cache clean success'
                });
            });
        });

        it('post zhanzhang.baidu.com', () => {
            return new MipCache({
                authkey: process.env.MIP_CACHE_AUTHKEY
            }).clear('http://mip.xuexb.com').then(data => {
                expect(data).to.deep.equal({
                    status: 0,
                    msg: 'cache clean success'
                });
            });
        });

        it('post zhanzhang.baidu.com is error', () => {
            return new MipCache({
                authkey: process.env.MIP_CACHE_AUTHKEY
            }).clear('http://mip.xuexb.com/post/xiaowu.html').then(data => {
                expect(data).to.deep.equal({
                    status: 0,
                    msg: 'cache clean success'
                });
            });
        });
    }
});

/* eslint-enable max-nested-callbacks */
