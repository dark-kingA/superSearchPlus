// 创建一个菜单项
chrome.contextMenus.create({
	title: 'superSearchPlus',
	id: 'menu1',
	contexts: ['link', 'selection', 'image', 'page'],
})

// 监听菜单项的单击事件
chrome.contextMenus.onClicked.addListener(function (info, tab) {
	if (info.menuItemId == 'menu1') {
		// 判断用户是否选中
		if (info.selectionText) {
			let searchValue = info.selectionText
			chrome.storage.sync.set({ searchValue }, function () {})
		}
		let initWith = '1'
		chrome.storage.sync.set({ initWith }, function () {
			chrome.tabs.create({ url: chrome.extension.getURL('popup.html') })
		})
	}
})
