const CheckUpdate = cb => {
  if (wx.canIUse('getUpdateManager')) {

    const updateManager = wx.getUpdateManager()

    // 请求完新版本信息的回调
    updateManager.onCheckForUpdate(function(res) {
      // if (!res.hasUpdate) {
        cb();
      // }
    })

    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
    updateManager.onUpdateReady(function() {
      updateManager.applyUpdate();
    })

    //新版本下载失败
    updateManager.onUpdateFailed(function() {
      wx.showModal({
        title: '版本更新',
        content: '请手动删除本小程序后重新搜索打开！',
        showCancel: false,
        success: cb
      })
    })

  } else {
    cb();
  }
}


module.exports = {
  CheckUpdate
}