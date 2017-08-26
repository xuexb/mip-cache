/**
 * @file 测试用例
 * @author xuexb <fe.xiaowu@gmail.com>
 */

import MipCache from '../src/';
import {expect} from 'chai';
import request from 'request';
import sinon from 'sinon';

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

    describe('#clear', done => {
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

        it('server error', done => {
            sinon.stub(request, 'post').yields('error');

            app.clear('http://xuexb.com').catch(err => {
                expect(err).to.deep.equal({
                    status: -1,
                    msg: 'error'
                });

                done();
            });
        });

        it('parse json error', done => {
            sinon.stub(request, 'post').yields(null, '', '{');

            app.clear('http://xuexb.com').catch(err => {
                expect(err).to.deep.equal({
                    status: -2,
                    msg: 'parse json error'
                });

                done();
            });
        });

        it('data error', done => {
            sinon.stub(request, 'post').yields(null, '', JSON.stringify({
                status: 1
            }));

            app.clear('http://xuexb.com').catch(err => {
                expect(err).to.deep.equal({
                    status: 1,
                    msg: 'server code error'
                });

                done();
            });
        });

        it('zhanzhang data error', done => {
            app.clear('http://xuexb.com').catch(err => {
                expect(err).to.deep.equal({
                    status: 1,
                    msg: 'auth check fail'
                });

                done();
            });
        });
    });

    if (process.env.MIP_TOKEN) {
        it('post zhanzhang.baidu.com', done => {
            new MipCache({
                authkey: process.env.MIP_TOKEN
            }).clear('https://mip.xuexb.com').then(data => {
                expect(data).to.deep.equal({
                    status: 0,
                    msg: 'cache clean success'
                });
                done();
            });
        });
    }
});
