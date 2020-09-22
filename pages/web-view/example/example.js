const {
  Api: {
    H5BaseUrl
  }
} = getApp().globalData;

const { GetRandom, GetToken } = require('../../../utils/util.js');

Page({
  data: {
    webviewUrl: `${H5BaseUrl}/h5url?token=${GetToken()}&random=${GetRandom()}&platform=wechat`,
  }
})