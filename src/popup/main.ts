import { langs } from './constants/langs'

window.addEventListener('load', async () => {
  const { to = 'en', engine = 'google' } = await chrome.storage.sync.get([
    'to',
    'engine',
  ])
  console.log('config: ', to, engine)
  const list = [
    {
      name: 'to',
      value: to,
      options: Object.entries(langs)
        .filter(([k]) => k !== 'auto')
        .map(([k, v]) => ({ label: v, value: k })),
    },
    {
      name: 'engine',
      value: engine,
      options: [
        { label: 'Google', value: 'google' },
        { label: 'Chatgpt', value: 'chatgpt' },
      ],
    },
  ]

  list.forEach((it) => {
    const $el = document.querySelector('#' + it.name)! as HTMLSelectElement
    $el.replaceChildren(
      ...it.options.map((option) => {
        const $option = document.createElement('option')
        $option.value = option.value
        $option.text = option.label
        if (option.value === it.value) {
          $option.selected = true
        }
        return $option
      }),
    )
    $el.addEventListener('change', () => {
      chrome.storage.sync.set({ [it.name]: $el.value })
    })
  })
})
