const { Debounce } = require('../../../utils/util.js');

const {
  Api: {
    ExampleUrl
  },
  $post,
} = getApp().globalData;

Page({
  data: {
    loading: false,
    name: "",
    phone: "",
    card: "",
    scan: ""
  },
  updateInput(e) {
    this.setData({
      [e.target.dataset.field]: e.detail
    })
  },
  submit: Debounce(function () {
    if (this.data.loading) {
      return;
    }

    this.setData({
      loading: true
    })

    $post(ExampleUrl, {
      name: this.data.name,
      phone: this.data.phone
    }).then((res) => {
      this.setData({
        loading: false
      });
    }, () => {
      setTimeout(() => {
        this.setData({
          loading: false
        })
      }, 3000)
    })
  }, 100)
})