import icon from './assets/icon-48.png'
import { google } from './translate/google'

async function translate(text: string) {
  const { to = 'en' } = await chrome.storage.sync.get(['to'])
  console.log('translate params: ', text, to)
  const r = await google({
    text,
    to,
  })
  console.log('translate result: ', r)
  chrome.notifications.create(
    {
      type: 'basic',
      title: 'translate-chrome-plugin',
      message: ' Translated: ' + r,
      iconUrl: icon,
    },
    (msj) => {
      setTimeout(() => {
        chrome.notifications.clear(msj)
      }, 1000)
    },
  )
  return r
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.text) {
    ;(async () => {
      sendResponse({ text: await translate(message.text) })
    })()
  }
  return true
})

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'translate-and-copy',
    title: 'Translate And Copy',
    contexts: ['selection'],
  })
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.selectionText) {
    const r = await translate(info.selectionText)
    console.log('info.selectionText: ', info.selectionText, r)
    chrome.tabs.sendMessage(tab!.id!, { action: 'copy', text: r })
  }
})

chrome.commands.onCommand.addListener(async (command, tab) => {
  console.log('command: ', command)
  if (command === 'translate') {
    chrome.tabs.sendMessage(tab.id!, { action: 'translate' })
  }
})
