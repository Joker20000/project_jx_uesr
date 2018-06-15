const app = getApp();

const json2FormFn = require('../../../static/libs/script/json2Form.js');//json转换函数

const feedbackUrl ='/salary/home/feedbacklist';//获取工资条反馈详情的url

const sendFeedbackUrl ='/salary/home/feedback';//工资条反馈的url

const feedbackDetailUrl ='/salary/home/feedbackdetail';//工资条反馈的url

Page({

    data: {

              isIpx: false,//是不是ipx

              fixedInput: false,//输入框input时候获得焦点

              feedBackList:[],//反馈消息列表

              contentTitle:'',//反馈内容

              feedBackId:'',//反馈消息Id

              userFeedBackList:'',

    },

    onShow: function () {

        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var that = this;

        wx.getSystemInfo({

            success: function success(res) {

                if (res.model == "iPhone X") {


                    that.setData({

                        isIpx:true
                    })

                }

            }
        })



        /**
         * 接口：获取工资条反馈详情
         * 请求方式：POST
         * 接口：/salary/home/feedbackdetail
         * 入参：pageNum,pageSize
         **/

        wx.request({

            url: app.globalData.URL +  feedbackDetailUrl,

            method: 'POST',

            data: json2FormFn.json2Form({

                salaryDetailId:wx.getStorageSync('salaryDetailId'),

            }),

            header: {

                'content-type': 'application/x-www-form-urlencoded', // post请求

                'jxsid':jx_sid,

                'Authorization':Authorization

            },


            success: function (res) {

                console.log(res.data);

                var list = res.data.data;

                that.setData({

                    feedBackList: list,//反馈消息列表

                });

/*           setTimeout(function () {

                    wx.pageScrollTo({

                        scrollTop: 999999
                    })

            },500)*/

            },

            fail: function (res) {

                console.log(res)
            }

        })

    },
    //工资条反馈
    sendMsgFn:function () {

        var jx_sid = wx.getStorageSync('jxsid');

        var Authorization = wx.getStorageSync('Authorization');

        var that = this;


        //判断输入内容
        if(!that.data.contentTitle){

            wx.showToast({

                title: '请输入反馈内容',
                icon: 'none',

            })


        }

        else {


            /**
             * 接口：工资条反馈
             * 请求方式：POST
             * 接口：/salary/home/getfeedback
             * 入参：salaryDetailId，salaryId，contentTitle
             *
             **/

            wx.request({

                url: app.globalData.URL + sendFeedbackUrl,

                method: 'POST',

                data: json2FormFn.json2Form({

                    salaryDetailId:wx.getStorageSync('salaryDetailId'),//工资详情Id

                    salaryId:wx.getStorageSync('salaryId'),//工资发放批次Id

                    contentTitle:that.data.contentTitle,//反馈内容


                }),

                header: {

                    'content-type': 'application/x-www-form-urlencoded', // post请求

                    'jxsid':jx_sid,

                    'Authorization':Authorization

                },


                success: function (res) {

                    console.log(res.data);

                    /*console.log(res.data.data)*/

                    if(res.data.code=='0000'){

                        wx.showToast({

                            title: res.data.msg,
                            icon: 'none',
                            duration:2000

                        });


                        var userImf={
                            feedBackDetailId: "1",
                            feedBackId: "123",
                            content: that.data.contentTitle,
                            type: "1",
                            sendDate: Date.parse(new Date())
                        }

                        var _list = that.data.feedBackList

                        _list.push(userImf)


                        //消息清空
                        that.setData({

                            contentTitle:'',

                            feedBackList:_list,//反馈消息列表

                        })

                        //平滑到底部

                        setTimeout(function () {

                            wx.pageScrollTo({

                                scrollTop: 999999
                            })

                        },200)

                    }

                    else {

                        wx.showToast({

                            title: res.data.msg,
                            icon: 'none',
                            duration:2000


                        });

                    }







                },

                fail: function (res) {

                    console.log(res)
                }

            })



        }



    },

    changeInput:function () {


        var that = this;

        that.setData({

            fixedInput: true,

        })




    },

    inputBlur:function () {

        var that = this;

        that.setData({

            fixedInput: false,

        })

    },

    inputChange:function (e) {

        var that = this;

        that.setData({

            contentTitle: e.detail.value,

        })



    }


});