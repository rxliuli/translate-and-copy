import icon from './assets/icon-48.png'
import { chatgpt } from './translate/chatgpt'
import { google } from './translate/google'

async function translate(text: string) {
  const { to = 'en', engine = 'google' } = await chrome.storage.sync.get([
    'to',
    'engine',
  ])
  console.log('translate params: ', text, to, engine)
  const r = await (engine === 'google' ? google : chatgpt)({
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
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    chrome.tabs.sendMessage(tabs[0].id!, { action: 'copy', text: r })
  }
})

chrome.commands.onCommand.addListener(async (command) => {
  console.log('command: ', command)
  if (command === 'translate') {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    chrome.tabs.sendMessage(tabs[0].id!, { action: 'translate' })
  }
})
