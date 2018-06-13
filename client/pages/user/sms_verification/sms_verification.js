/**
 * Created by ZHUANGYI on 2018/5/20.
 */

const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const withdrawmsgUrl = '/jx/action/withdrawmsg';//提现发送短信认证

const cashUrl = '/user/withdraw/dowithdraw';// 用户发起提现操作



Page({

    data:{

        mobile:'',//手机号

        newMobile:'',

        last_time:'',//倒计时

        idNumber:'',//份证号

        tokenMsg:'',//验证码标识

        code:'',//验证码



    },
    onLoad:function () {


        var thisWithdrawmsgUrl= app.globalData.URL+withdrawmsgUrl;

        var that = this;

        //有几个ajax请求
        var ajaxCount = 1;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var _mobile = wx.getStorageSync('mobile');

        var countdown = 60;

        that.setData({

            mobile:_mobile,

            newMobile:_mobile.substr(0, 3) + '****' + _mobile.substr(7),

            locked:0,

        });

        //console.log(_mobile)

        settime(that);

        function settime(that) {

            if (countdown < 0) {

                that.setData({

                    locked:1,
                })


                countdown = 60;

                return;

            } else {



                that.setData({

                    locked:0,

                    last_time:countdown

                });

                countdown--;
            }
            setTimeout(function () {
                    settime(that)
                }
                , 1000)


        }

        console.log(that.data.mobile)

        /**
         * 接口：提现发送短信认证
         * 请求方式：GET
         * 接口：/jx/action/withdrawmsg
         * 入参：moblie
         * */

        wx.request({

            url: thisWithdrawmsgUrl,

            method: 'GET',

            data:{

                mobile:that.data.mobile,


            },
            header:{

                'jxsid':jx_sid,

                'Authorization':Authorization

            },

            success: function (res) {

                console.log(res.data);

                app.globalData.repeat(res.data.code,res.data.msg);

                if(res.data.code=='3001') {

                    //console.log('登录');

                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 1500,
                        success:function () {

                            setTimeout(function () {

                                wx.reLaunch({

                                    url:'../../common/signin/signin'
                                })

                            },1500)

                        }

                    })

                    return false


                }

                else {

                    (function countDownAjax() {

                        ajaxCount--;

                        app.globalData.ajaxFinish(ajaxCount)

                    })();


                    if (res.data.code == '0000') {

                        wx.showToast({

                            title: res.data.msg,

                            icon: 'none',

                        })


                    }
                    else {

                        wx.showToast({

                            title: res.data.msg,

                            icon: 'none',
                        })


                    }

                }




            },


            fail: function (res) {

                console.log(res)

            }

        })
        






    },

    buttonCheck:function () {

        var that = this;

        var thisCashUrl = app.globalData.URL + cashUrl;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var _balance = wx.getStorageSync('balance');

        var _bankCardId = wx.getStorageSync('bankCardId')


        //console.log(that.data.code)

        console.log({

            bankCardId: _bankCardId,//银行卡id

            balance: _balance,//提取现金

            code: that.data.code,//短信验证


        })


        /**
         * 接口：获取账户提现记录
         * 请求方式：GET
         * 接口：/user/withdraw/dowithdraw
         * 入参：bizId,bankCardId,balance,payPassword,code
         * */

        wx.request({

            url: thisCashUrl,

            method: 'GET',

            data: {

                bankCardId: _bankCardId,//银行卡id

                balance: _balance,//提取现金

                code: that.data.code,//短信验证


            },
            header: {

                'jxsid': jx_sid,

                'Authorization': Authorization

            },

            success: function (res) {

                console.log(res.data);


                //缓存点单号
                wx.setStorageSync('cashOrderId',res.data.data);

                if (res.data.code == '0000') {


                    wx.showToast({

                        title: res.data.msg,

                        icon: 'none',

                    })

                    wx.redirectTo({

                        url: '../pay_success/pay_success'
                    })

                }

                else {

                    wx.showToast({

                        title: res.data.msg,

                        icon: 'none',

                    })
                }

            },


            fail: function (res) {

                console.log(res)

            }

        })




    },
    
    codeFn:function (e) {

        var that = this;

        that.setData({

            code:e.detail.value,

        })

    },

    hasCodeFn:function () {

        var that = this;

        var thisWithdrawmsgUrl= app.globalData.URL+withdrawmsgUrl;

        //缓存jx_sid&&Authorization数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var countdown = 60;

        settime(that);

        function settime(that) {

            if (countdown < 0) {

                that.setData({

                    locked:1,

                });

                countdown = 60;

                return;

            } else {

                that.setData({

                    last_time:countdown,

                    locked:0,

                });
                countdown--;
            }
            setTimeout(function () {
                    settime(that)
                }
                , 1000)


        }
        /**
         * 接口：提现发送短信认证
         * 请求方式：GET
         * 接口：/jx/action/withdrawmsg
         * 入参：moblie
         * */

        wx.request({

            url: thisWithdrawmsgUrl,

            method: 'GET',

            data:{

                mobile:that.data.mobile,


            },
            header:{

                'jxsid':jx_sid,

                'Authorization':Authorization

            },

            success: function (res) {

                console.log(res.data);

                if(res.data.code=='0000'){

                    wx.showToast({

                        title: res.data.msg,

                        icon: 'none',

                    })


                }
                else {

                    wx.showToast({

                        title: res.data.msg,

                        icon: 'none',
                    })


                }




            },


            fail: function (res) {

                console.log(res)

            }

        })



    }



})

