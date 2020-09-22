const {
  GetPrevPage,
  Debounce
} = require('../../../utils/util.js');

const { Api: { ExampleUrl }, $upload } = getApp().globalData;



Page({
  data: {
    loading: false,
    flash: "auto", // on, off
    photo: "",
    type: "",
    typeEnum: ["bankCard", "idcardFront", "idcardBack"],
  },
  onLoad: function (option) {
    this.setData({
      type: option.type || ''
    })
  },
  toggleFlash() {
    this.setData({
      flash: this.data.flash == "on" || this.data.flash == "auto" ? "off" : "on"
    })
  },
  takePhoto: Debounce(function () {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      success: (res) => {
        if (this.data.typeEnum[this.data.type] == "bankCard") {
          wx.showLoading({
            title: '识别中',
            mask: true
          })
          this.scanBankCard(res.tempImagePath)
        } else if (this.data.typeEnum[this.data.type] == "idcardFront") {
          if (this.data.source == 'add') {
            wx.showLoading({
              title: '识别中',
              mask: true
            })
            this.scanFrontIdCard(res.tempImagePath)
          } else {
            this.scanIdCard(res.tempImagePath, "frontUrl")
          }
        } else if (this.data.typeEnum[this.data.type] == "idcardBack") {
          this.scanIdCard(res.tempImagePath, "backUrl")
        }
      }
    })
  }, 100),
  getPrevPage() {
    const CurrentPages = getCurrentPages();
    return CurrentPages[CurrentPages.length - 2];
  },
  scanIdCard(photo, key) {
    const Page = GetPrevPage();
    Page.setData({
      [key]: photo
    })
    wx.navigateBack();
  },
  scanBankCard(photo) {
    $upload(ExampleUrl, { photo: photo }, false).then((res) => {
      const Page = GetPrevPage();
      Page.setData({
        bindMedium: res.bankCardNum,
        bankName: res.bankName,
        sanBankCode: res.bankCode,
      });
      wx.navigateBack();
      wx.hideLoading()
    }, () => {
      this.setData({
        loading: false
      })
    })
  },
  scanFrontIdCard(photo) {
    $upload(ExampleUrl, { photo: photo }, false).then((res) => {
      const Page = GetPrevPage();

      Page.setData({
        idCard: res.id.replace("x", "X"),
        name: res.name,
      });

      wx.navigateBack();
      wx.hideLoading()
    }, () => {
      setTimeout(() => {
        this.setData({
          loading: false
        })
      }, 3000)
    })
  },
})