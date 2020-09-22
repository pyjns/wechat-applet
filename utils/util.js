const PhoneReg = (phone) => {
  if (!/^1[0-9]{10}$/.test(phone)) {
    wx.showToast({
      title: '请输入有效的手机号',
      icon: 'none'
    })
    return true;
  }
  return false;
}


const ErrorTip = () => {
  wx.showToast({
    icon: "none",
    title: "网络不稳定，请稍后再试～"
  });
}

function Debounce(fn, wait) {
  var timeout;
  return function () {
    var ctx = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      fn.apply(ctx, args);
    }, wait);
  };
}

function GetRandom() {
  return `${new Date().getTime()}${Math.ceil(Math.random() * 1000)}`
}

function GetToken() {
  return getApp().globalData.Token || wx.getStorageSync('Token') || '';
}

function GetPrevPage() {
  const CurrentPages = getCurrentPages();
  return CurrentPages[CurrentPages.length - 2];
}

module.exports = {
  PhoneReg,
  ErrorTip,
  Debounce,
  GetRandom,
  GetToken,
  GetPrevPage
}