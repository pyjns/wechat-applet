
Component({
  data: {
    type: "",
    typeList: [
      { id: "", name: "全部" },
      { id: 0, name: "餐饮消费" },
      { id: 1, name: "娱乐消费" }
    ],
    status: "",
    statusList: [
      { id: '', name: '全部' },
      { id: 2, name: '已付款' },
      { id: 3, name: '已退款' }
    ],
    userArrow: false,
    typeArrow: false,
  },
  properties: {},
  lifetimes: {
    attached: function () { }
  },
  methods: {
    tapPicker(e) {
      this.setData({
        [e.currentTarget.dataset.arrow]: true
      });
    },
    cancelPicker(e) {
      this.setData({
        [e.target.dataset.arrow]: false
      });
    },
    changePicker(e) {
      this.setData({
        [e.target.dataset.arrow]: false,
        [e.target.dataset.key]: e.detail.value
      });
      let type = this.data.typeList[this.data.type];
      let status = this.data.statusList[this.data.status];

      let searchParam = {
        type: type ? type.id : "",
        status: status ? status.id : "",
      }
      this.triggerEvent('search', searchParam, {})
    }
  }
})