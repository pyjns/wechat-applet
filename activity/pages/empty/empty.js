const {
  Api: { },
  $get,
  $post
} = getApp({
  allowDefault: true
}).globalData;

Page({
  data: {
    options: {}
  },
  onLoad: function (options) {
    this.setData({
      options: options
    })
  }
})