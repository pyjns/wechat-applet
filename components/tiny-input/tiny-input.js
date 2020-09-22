Component({
  properties: {
    placeholder: {
      type: String,
      value: "",
    },
    maxlength: {
      type: String,
      value: "20",
    },
    label: {
      type: String,
      value: "",
    },
    inputValue: {
      type: String,
      value: "",
    },
  },
  data: {
    inputValue: "",
    inputFocus: false,
    showPwd: true,
  },
  methods: {
    onInput(e) {
      this.setData({
        inputValue: e.detail.value.trim()
      })
      this.triggerEvent("update", this.data.inputValue);
    },
    focusInput(e) {
      this.setData({
        inputFocus: true
      })
    },
    blurInput(e) {
      this.setData({
        inputFocus: false
      })
    },
    clearInput: function (e) {
      setTimeout(() => {
        this.setData({
          inputValue: "",
          inputFocus: true
        })
      }, 0)
    },
  }
})