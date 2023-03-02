import { ITranslate } from './base'

export const chatgpt: ITranslate = async (params) => {
  const r = await fetch('https://ai.rxliuli.com/translate', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: params.text,
      from: params.from ?? 'auto',
      to: params.to,
    }),
  })
  return await r.text()
}
