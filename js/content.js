/**
 * 获取vue-router的options
 * @auther:不懂安全的开发
 */
const enableDevtools = () => {
	setChromeStorage(null)
	const script = document.createElement('script')
	let appId = [
		'app',
		'root',
		'__nuxt',
		'main',
		'vue-app',
		'app-container',
		'app-view',
		'app-root',
	]
	let checkId = ''
	for (let i = 0; i < appId.length; i++) {
		if (document.querySelector(`#${appId[i]}`)) {
			checkId = appId[i]
			break
		}
	}
	if (!checkId) {
		return
	}
	script.textContent = 'let options = JSON.stringify(document.querySelector("'
	script.textContent += `#${checkId}"`
	script.textContent += ').__vue__.$children[0].$router.options);'
	script.textContent += 'const div = document.createElement("div");'
	script.textContent += 'div.innerHTML = options;'
	script.textContent += 'div.setAttribute("id", "vue-router-options");'
	script.textContent += 'document.body.appendChild(div);'
	document.documentElement.appendChild(script)
	const div = document.querySelector('#vue-router-options')
	const optionsHtml = div.innerHTML
	if (!optionsHtml) {
		optionsHtml = null
	}
	setChromeStorage(optionsHtml)
	document.body.removeChild(div)
	document.documentElement.removeChild(script)
}
const setChromeStorage = (optionsHtml) => {
	if (optionsHtml) {
		optionsHtml = JSON.parse(optionsHtml)
		optionsHtml.key = document.location.host
		optionsHtml = JSON.stringify(optionsHtml)
	}
	chrome.storage.sync.set({ optionsHtml }, function () {})
}
setTimeout(enableDevtools, 1000)
