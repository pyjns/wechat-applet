const {
  Api: {
    ExampleUrl
  },
  $get
} = getApp().globalData;

Page({
  data: {
    listData: [],
    page: 1,
    size: 10,
    status: "",
    type: "",
    lowerThreshold: 88,
    finished: false,
    isRefresh: true,
  },
  onShow: function () {
    this.reset();
    // this.searchData();
    this.searchDataLocal();
  },
  reset() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    });
  },
  search(e) {
    this.reset();
    let { status, type } = e.detail;

    this.setData({
      page: 1,
      status,
      type,
    })
    // this.searchData();
    this.searchDataLocal();
  },
  onPullDownRefresh() {
    this.setData({
      page: 1
    });

    // this.searchData();
    this.searchDataLocal();
    wx.stopPullDownRefresh();
  },
  onReachBottom() {
    if (this.data.finished) {
      return false;
    }

    this.setData({
      page: ++this.data.page
    });

    // this.searchData();
    this.searchDataLocal();
  },
  searchDataLocal: function () {
    setTimeout(() => {

      let tempList = []
      for (let i = this.data.listData.length; i < this.data.listData.length + 10; i++) {
        tempList.push(i);
      }
      this.setData({
        finished: this.data.listData.length >= 60,
        listData: this.data.page > 1 ? this.data.listData.concat(tempList) : tempList
      })

    }, 500);
  },
  searchData: function () {
    $get({
      url: OrderList,
      params: {
        page: this.data.page,
        size: this.data.size,
        type: this.data.type,
        status: this.data.status,
      },
    }, this.data.page == 1).then((res) => {
      this.setData({
        finished: (res.resultCount < this.data.size),
        listData: this.data.page > 1 ? this.data.listData.concat(res.resultList) : res.resultList
      })
    }, () => {
      this.setData({
        page: --this.data.page
      });
    })
  }
})