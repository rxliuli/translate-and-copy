import { getSelect, writeClipboard } from './utils/DOMEditorUtil'

async function translate(text: string): Promise<string> {
  const r = await chrome.runtime.sendMessage({ text })
  console.log('resp: ', r)
  return r.text
}

async function translateSelect() {
  const text = getSelect()
  if (text === null) {
    console.warn("don't select text")
    return
  }
  const r = await translate(text)
  await writeClipboard(r as string)
}

// document.addEventListener('keydown', async (e) => {
//   if (e.altKey && e.key === 't') {
//     await translateSelect()
//   }
// })

chrome.runtime.onMessage.addListener(async (message) => {
  console.log('onCopy: ', message)
  switch (message.action) {
    case 'copy':
      await writeClipboard(message.text as string)
      break
    case 'translate':
      await translateSelect()
      break
    default:
      console.warn('unknown command', message)
  }
})
