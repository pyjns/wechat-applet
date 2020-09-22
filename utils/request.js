const { GetToken } = require('./util.js');

const { ExampleUrl } = require("./api.js");


function GetHeader() {
  return {
    platform: "wechat",
    Token: GetToken()
  }
}

const handleResponse = function (resolve, reject, res) {
  wx.hideLoading();
  if (res.statusCode !== 200) {
    reject(); return;
  }
  let Data = res.data;

  if (typeof Data == "string") {
    Data = JSON.parse(Data)
  }

  if (Data.code == 200) {
    resolve(Data);
  } else if (Data.code == 513 || Data.code == 516 || Data.code == 512) {
    wx.showToast({
      icon: "none",
      duration: 5000,
      title: Data.subMessage
    });
  } else if (Data.code == 401) { //重新登录
    getApp().globalData.Token = "";
    wx.clearStorage();
    wx.reLaunch({
      url: "/pages/account/login/login",
    })
  } else {
    wx.showToast({
      icon: "none",
      title: "网络不稳定，请稍后再试～"
    });
  }
  reject(Data)
};

const _request = (url, params, method, loading) => {
  if (loading) {
    wx.showLoading({
      title: '请稍等...',
    })
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method,
      timeout: 20000,
      data: params,
      header: GetHeader(),
      success: function (res) {
        handleResponse(resolve, reject, res);
      }, fail: function (err) {
        if (loading) {
          wx.hideLoading();
        } else {
          wx.showToast({
            icon: "none",
            title: "网络不稳定，请稍后再试～"
          });
        }
        reject({});
      }
    });
  });
}

const $upload = (url, params, loading = false) => {
  if (loading) {
    wx.showLoading({
      title: '加载中',
    })
  }

  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url,
      filePath: params.photo,
      name: 'file',
      header: GetHeader(),
      success(res) {
        handleResponse(resolve, reject, res);
      },
      fail(error) {
        wx.showToast({
          icon: "none",
          title: "上传失败"
        });
        reject();
      }
    })
  });
}

const $get = (url, params, loading = false) => {
  return _request(url, params, "GET", loading);
}
const $post = (url, params, loading = false) => {
  return _request(url, params, "POST", loading);
}

const $getUserInfo = function (callback) {
  $get(ExampleUrl, {}, true).then((res) => {
    if (res) {
      const UserInfo = res.UserInfo;
      getApp().globalData.UserInfo = UserInfo;
      callback && callback(UserInfo);
    }
  })
}

module.exports = {
  $get,
  $post,
  $upload,
  $getUserInfo,
}