Component({
  properties: {
    btnText: {
      type: String,
      value: "提交",
    },
    loading: {
      type: Boolean,
      value: false,
    },
  },
  methods: {
    submit() {
      if (this.data.loading) {
        return false;
      }

      this.setData({
        loading: true
      });

      this.triggerEvent("submit");
    }
  }
})
