
const {
  Debounce
} = require('../../../utils/util.js');

const {
  Api: {
    ExampleUrl
  },
  $post,
  $upload
} = getApp().globalData;

Page({
  data: {
    loading: false,
    frontUrl: "",
    backUrl: "",
    scan: {
      id: "",
      name: "",
      address: "",
      rsignDate: "",
      validityPeriod: "",
      foreverFlag: "",
    },
  },
  clearPhoto(e) {
    this.setData({
      [e.target.dataset.filed]: ""
    })
  },
  getPrevPage() {
    const CurrentPages = getCurrentPages();
    const Page = CurrentPages[CurrentPages.length - 2];
    return Page;
  },
  scanIdCard(photo, idCardType) {
    const _this = this;
    return new Promise((resolve, reject) => {
      $upload({
        url: ExampleUrl + `?imageType=${idCardType}`,
        params: {
          photo: photo
        }
      }, false).then((res) => {
        for (let key in res) {
          this.setData({
            [`scan.${key}`]: res[key]
          })
        };
        resolve();
      }, () => {
        this.setData({
          loading: false
        })
        reject();
      })
    });
  },
  submit: Debounce(function () {
    if (this.data.frontUrl == "") {
      wx.showToast({
        title: "请拍摄身份证人像面",
        icon: "none"
      });
      return false;
    }

    if (this.data.backUrl == "") {
      wx.showToast({
        title: "请拍摄身份证国徽面",
        icon: "none"
      });
      return false;
    }

    if (this.data.loading) {
      return false;
    }

    this.setData({
      loading: true
    })

    const scanFront = this.scanIdCard(this.data.frontUrl, 'front');
    const scanBack = this.scanIdCard(this.data.backUrl, 'back');

    Promise.all([scanFront, scanBack]).then(() => {
      this.uploadIdcard();
    }, () => {
      this.setData({
        loading: false
      })
    })
  }, 100),
  uploadIdcard() {
    $post({
      url: ExampleUrl,
      params: {},
    }).then(res => {
      for (let key in res) {
        this.setData({
          [`scan.${key}`]: res[key]
        })
      };

      const Page = this.getPrevPage();

      Page.setData({
        scan: this.data.scan
      })

      this.setData({
        loading: false
      });

      wx.navigateBack();
    }, () => {
      this.setData({
        loading: false
      })
    })
  }
})