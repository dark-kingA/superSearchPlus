// 代码来源：https://github.com/xpl/crx-hotreload/edit/master/hot-reload.js
const filesInDirectory = dir => new Promise(resolve =>
  dir.createReader().readEntries(entries =>
    Promise.all(entries.filter(e => e.name[0] !== '.').map(e =>
      e.isDirectory
        ? filesInDirectory(e)
        : new Promise(resolve => e.file(resolve))
    ))
      .then(files => [].concat(...files))
      .then(resolve)
  )
)

const timestampForFilesInDirectory = dir =>
  filesInDirectory(dir).then(files =>
    files.map(f => f.name + f.lastModifiedDate).join())

const reload = () => {
  window.chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => { // NB: see https://github.com/xpl/crx-hotreload/issues/5
    if (tabs[0]) {
      window.chrome.tabs.reload(tabs[0].id)
    }
    window.chrome.runtime.reload()
  })
}

const watchChanges = (dir, lastTimestamp) => {
  timestampForFilesInDirectory(dir).then(timestamp => {
    if (!lastTimestamp || (lastTimestamp === timestamp)) {
      setTimeout(() => watchChanges(dir, timestamp), 1000) // retry after 1s
    } else {
      reload()
    }
  })
}

window.chrome.management.getSelf(self => {
  if (self.installType === 'development') {
    window.chrome.runtime.getPackageDirectoryEntry(dir => watchChanges(dir))
  }
})
