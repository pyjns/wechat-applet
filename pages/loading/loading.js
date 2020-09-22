import Updator from "../../utils/update.js";

Page({
  onLoad: function (options) {
    //检查更新
    Updator.CheckUpdate(function () {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    });
  }
})
