import {
  $get,
  $post,
  $upload,
  $getUserInfo
} from './utils/request.js';
import Api from "./utils/api.js";
import Log from "./utils/log.js";

App({
  globalData: {
    $get,
    $post,
    $upload,
    $getUserInfo,
    Api,
    Log,
    Token: "",
    PixelRatio: 2,
    WindowWidth: "",
    OpenId: "",
    UnionId: "",
  },
  onLaunch: function () {
    this.init();
  },
  init() {
    const _this = this;
    const globalKeys = ['Token', 'OpenId', 'UnionId', 'WindowWidth', 'PixelRatio']
    for (let key of globalKeys) {
      wx.getStorage({
        key: key,
        success(res) {
          if (res.data) {
            _this.globalData[key] = res.data;
          }
        },
        complete() {
          (key == "WindowWidth") && !_this.globalData[key] && _this.initSystemInfo();
        }
      })
    };
  },
  initSystemInfo() {
    var _this = this;
    wx.getSystemInfo({
      success(res) {
        _this.globalData.WindowWidth = res.windowWidth;
        _this.globalData.PixelRatio = res.pixelRatio;
        wx.setStorage({
          key: "WindowWidth",
          data: res.windowWidth
        });
        wx.setStorage({
          key: "PixelRatio",
          data: res.pixelRatio
        });
      }
    })
  }
})