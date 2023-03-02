import { TranslateOptions } from '@liuli-util/google-translate-api-free'

interface TranslateParams {
  text: string
  from?: TranslateOptions['from']
  to: TranslateOptions['to']
}

export type ITranslate = (params: TranslateParams) => Promise<string>
