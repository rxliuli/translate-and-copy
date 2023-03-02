import {
  ITranslatorHandler,
  Translator,
} from '@liuli-util/google-translate-api-free'
import { ITranslate } from './base'

class TranslatorHandler implements ITranslatorHandler {
  async handle<T>(url: string): Promise<T> {
    const resp = await fetch(url, {
      method: 'get',
    })
    const r = await resp.json()
    return r as T
  }
}

export const google: ITranslate = async (params) => {
  const translator = new Translator(new TranslatorHandler())
  const r = await translator.translate(params.text, {
    to: params.to,
  })
  return r.text
}
