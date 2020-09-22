const {
  Api: { ExampleUrl },
  $post,
  $get } = getApp().globalData;


Page({
  data: {
    list: [1, 2, 3, 4],
    translateX: 'translateX(0px)',
    transitionDuration: '0ms',
    scaleY: 'scaleY(0.8)',
    swiperCurrent: 0,
    stepPrevious: -1,
    stepNext: 1,
    htmlFontSize: 0,
    liWith: 0,
    ulWith: 0,
    direction: '',
    pace: 0,
    deltaX: 0,
    deltaY: 0,
    offsetX: 0,
    offsetY: 0,
    minOffset: 0,
    currentScaleNum: 1,
    nextScaleNum: 0.8,
    currentScale: 'scaleY(1)',
    nextScale: 'scaleY(0.8)',
  },
  onShow() {
    this.init();

  },
  onPullDownRefresh() {
    this.init();
    wx.stopPullDownRefresh();
  },

  init() {

    const WindowWidth = getApp().globalData.WindowWidth;
    const list = this.data.list

    var fontSize = 100 * (WindowWidth / 750);
    var liWith = Math.floor(this.accMul(6.9, fontSize));

    this.setData({
      liLength: list.length,
      htmlFontSize: fontSize,
      liWith: liWith,
      minOffset: Math.floor(this.accAdd(this.accMul(0.12, fontSize), liWith))
    });
    this.resizeUlWith();

  },
  resizeUlWith: function resizeUlWith() {
    var ulWith = this.accAdd(
      this.accMul(this.data.liWith, this.data.liLength),
      this.accMul(this.accMul(0.12, this.data.htmlFontSize), this.data.liLength - 1)
    )
    this.setData({
      ulWith: ulWith
    })
  },
  accMul: function accMul(arg1, arg2) {
    var m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString();
    try {
      m += s1.split('.')[1].length;
    } catch (e) { }
    try {
      m += s2.split('.')[1].length;
    } catch (e) { }
    return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
  },
  accAdd: function accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    c = Math.abs(r1 - r2);
    if (c > 0) {
      var cm = Math.pow(10, c);
      if (r1 > r2) {
        arg1 = Number(arg1.toString().replace('.', ''));
        arg2 = Number(arg2.toString().replace('.', '')) * cm;
      } else {
        arg1 = Number(arg1.toString().replace('.', '')) * cm;
        arg2 = Number(arg2.toString().replace('.', ''));
      }
    } else {
      arg1 = Number(arg1.toString().replace('.', ''));
      arg2 = Number(arg2.toString().replace('.', ''));
    }
    return (arg1 + arg2) / m;
  },
  accSub: function accSub(arg1, arg2) {
    var r1, r2, m;
    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (this.accMul(arg1, m) - this.accMul(arg2, m)) / m;
  },
  toFixed: function jsToFixed(arg1, arg2) {
    var result = Math.round(arg1 * Math.pow(10, arg2)) / Math.pow(10, arg2);
    return result.toFixed(arg2);
  },
  delta: function delta() {
    return this.vertical ? this.deltaY : this.deltaX;
  },
  getDirection: function getDirection(x, y) {
    var MIN_DISTANCE = 10;
    if (x > y && x > MIN_DISTANCE) {
      return 'horizontal';
    }

    if (y > x && y > MIN_DISTANCE) {
      return 'vertical';
    }

    return '';
  },
  isCorrectDirection: function isCorrectDirection() {
    if (
      (this.data.swiperCurrent == this.data.liLength - 1 && this.data.pace > 0) ||
      (this.data.swiperCurrent == 0 && this.data.pace < 0) ||
      (this.data.liLength < 2) ||
      (this.data.direction == 'vertical')
    ) {
      return false;
    } else {
      return true;
    }
  },
  resetTouchStatus: function resetTouchStatus() {
    this.setData({
      direction: '',
      deltaX: 0,
      deltaY: 0,
      offsetX: 0,
      offsetY: 0,
      transitionDuration: '0ms'
    });
  },
  touchStart: function touchStart(event) {
    // console.log('start');
    this.resetTouchStatus();
    this.setData({
      startX: event.touches[0].clientX,
      startY: event.touches[0].clientY
    });
  },
  touchMove: function touchMove(event) {
    // console.log('move');
    var touch = event.touches[0];
    this.setData({
      deltaX: touch.clientX - this.data.startX,
      deltaY: touch.clientY - this.data.startY,
      offsetX: Math.abs(this.data.deltaX),
      offsetY: Math.abs(this.data.deltaY),
      direction: this.data.direction || this.getDirection(this.data.offsetX, this.data.offsetY),
      pace: this.data.offsetX > 0 ? (this.data.deltaX > 0 ? -1 : 1) : 0
    });

    if (this.isCorrectDirection()) {

      var offset = this.accMul(-this.data.pace, this.range(this.data.offsetX, 0, this.data.minOffset));


      var scaleNum = (Math.abs(offset) / this.data.liWith) * 0.2;


      this.setData({
        currentScaleNum: Math.max(1 - scaleNum, 0.8),
        nextScaleNum: Math.min(this.accAdd(0.8, scaleNum), 1)
      });

      this.move({
        offset: offset,
        step: 0
      });

      // event.preventDefault();
    }
  },
  touchEnd: function touchEnd(event) {
    // console.log('end');
    if (this.isCorrectDirection() && this.data.offsetX > 0) {
      var minOffsetNum = -this.accMul(this.data.pace, this.data.minOffset);

      this.setData({
        currentScaleNum: 1,
        nextScaleNum: 0.8,
        transitionDuration: '500ms'
      });

      this.move({
        offset: minOffsetNum,
        step: this.data.pace,
      });

      this.setData({
        swiperCurrent: this.range(this.data.swiperCurrent + this.data.pace, 0, this.data.liLength - 1)
      });


      if (this.data.pace > 0) { //像右
        this.setData({
          stepNext: this.range(this.data.swiperCurrent + this.data.pace, 0, this.data.liLength),
          stepPrevious: this.range(this.data.swiperCurrent - this.data.pace, -1, this.data.liLength - 2)
        });
      } else { //像左
        this.setData({
          stepNext: this.range(this.data.swiperCurrent + this.data.pace, -1, this.data.liLength - 2),
          stepPrevious: this.range(this.data.swiperCurrent - this.data.pace, 0, this.data.liLength)
        });
      }

      // console.log(this.stepPrevious + "   " + this.swiperCurrent + "   " + this.stepNext)
    }
  },
  range: function range(num, min, max) {
    return Math.min(Math.max(num, min), max);
  },
  move: function move(obj) {

    var targetOffset = this.accAdd(obj.offset, -this.accMul(this.data.minOffset, this.data.swiperCurrent));

    this.setData({
      currentScale: 'scaleY(' + this.data.currentScaleNum + ')',
      nextScale: 'scaleY(' + this.data.nextScaleNum + ')',
      translateX: 'translateX(' + targetOffset + 'px)'
    });

    // console.log(`minOffset${'-'.repeat(10)}${this.data.minOffset}`)
    // console.log(`targetOffset${'-'.repeat(10)}${targetOffset}`)

    // console.log(this.swiperCurrent + "||||||||||||" + this.stepNext)

  },
  getScale(index) {
    var str = 'scaleY(0.8)';
    if (index === this.data.swiperCurrent) {
      str = this.data.currentScale;
    } else if (index === this.data.stepNext || index === this.data.stepPrevious) {
      str = this.data.nextScale;
    }

    // console.log(str)
    return str;
  }
})