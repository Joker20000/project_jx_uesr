
const app = getApp();

const json2FormFn = require( '../../../static/libs/script/json2Form.js' );//json转换函数

const mineUrl ='/user/center/usercenter';//用户中心

const joinEntURL = '/user/workunit/selectisjoinent'//有带加入企业




Page({

    data:{


        mobile:'',//个人中心手机号

        wages:'',//工资余额

        hasJoinEnt:true,//默认不显示有新的邀请 true为不显示 false为显示


    },

    onShow:function () {

        //console.log('刷新')

        var thisMineurl = app.globalData.URL+ mineUrl;

        var thisJoinEntURL = app.globalData.URL + joinEntURL;

        var that = this;

        //获取数据
        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        //获取余额
        var thisWages = wx.getStorageSync('wages');



        /**
         * 接口：用户中心
         * 请求方式：POST
         * 接口：/user/center/usercenter
         * 入参：mobile
         **/
        wx.request({

            url:  thisMineurl,

            method:'POST',

            header: {
                'content-type': 'application/x-www-form-urlencoded', // post请求

                'jxsid':jx_sid,

                'Authorization':Authorization

            },

            success: function(res) {

                console.log(res.data);

                var _mobile = res.data.data.mobile.substr(0, 3) + '****' + res.data.data.mobile.substr(7)

                //存储手机号码
               that.setData({

                    mobile:_mobile
                });

                //存储余额
                that.setData({
                    wages:thisWages
                })

                //获取手机号
                wx.setStorageSync('mobile',res.data.data.mobile);

                //获取是否设置密码
                wx.setStorageSync('isPayPwd',res.data.data.isPayPwd);

                //是否开启验证
                wx.setStorageSync('isSecurity',res.data.data.isSecurity);


                //是否开启验证
                wx.setStorageSync('isVerify',res.data.data.isVerify);

                //console.log('认证'+wx.getStorageSync('isVerify'))


            },

            fail:function (res) {

                console.log(res)
            }

        })


        /**
         * 接口：有待加入企业
         * 请求方式：GET
         * 接口：/user/workunit/selectisjoinent
         * 入参：null
         **/
        wx.request({

            url:  thisJoinEntURL,

            method:'GET',

            header: {

                'jxsid':jx_sid,

                'Authorization':Authorization

            },

            success: function(res) {

                console.log(res.data);


                //判断是否显示有新邀请

                var hasEntType = res.data.data.type;

                if(hasEntType=='1'){

                    that.setData({

                        hasJoinEnt:false,

                    })

                }

                else {

                    that.setData({

                        hasJoinEnt:true

                    })

                }






            },

            fail:function (res) {

                console.log(res)
            }

        })

    },





});