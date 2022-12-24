import {
  ITranslatorHandler,
  Translator,
} from '@liuli-util/google-translate-api-free'
import icon from '../assets/icon-48.png'

class TranslatorHandler implements ITranslatorHandler {
  async handle<T>(url: string): Promise<T> {
    const resp = await fetch(url, {
      method: 'get',
    })
    const r = await resp.json()
    return r as T
  }
}

const translator = new Translator(new TranslatorHandler())

async function translate(message: string) {
  const language = (await browser.storage.sync.get('to')).to ?? 'en'
  const { text } = await translator.translate(message, {
    to: language,
  })
  console.log('translated: ', text)
  const msj = await browser.notifications.create({
    type: 'basic',
    title: 'translate-chrome-plugin',
    message: ' Translated: ' + text,
    iconUrl: icon,
  })
  setTimeout(() => {
    browser.notifications.clear(msj)
  }, 1000)
  return text
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.text) {
    ;(async () => {
      sendResponse({ text: await translate(message.text) })
    })()
  }
  return true
})

browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: 'translate-and-copy',
    title: 'Translate And Copy',
    contexts: ['selection'],
  })
})

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.selectionText) {
    const r = await translate(info.selectionText)
    console.log('info.selectionText: ', info.selectionText, r)
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    browser.tabs.sendMessage(tabs[0].id!, { action: 'copy', text: r })
  }
})

browser.commands.onCommand.addListener(async (command) => {
  console.log('command: ', command)
  if (command === 'translate') {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    browser.tabs.sendMessage(tabs[0].id!, { action: 'translate' })
  }
})
