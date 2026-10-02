import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import App from '../App'
import { CharacterProvider } from '../state/CharacterProvider'
import { ACTIONS } from '../constants/playbooks'
import { ACTION_DESCRIPTIONS } from '../constants/actionDescriptions'

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

describe('シートの技能説明', () => {
  it('未選択でも全12技能の用途・使用例・使い分けを標準ツールチップで提供する', () => {
    window.localStorage.clear()
    render(<CharacterProvider><App /></CharacterProvider>)
    for (const action of ACTIONS) {
      const name = screen.getByText(action.ja, { selector: '.os-rating__name .os-bi__ja' })
      const title = name.closest('.os-rating__name')?.getAttribute('title')
      const description = ACTION_DESCRIPTIONS[action.id]
      expect(title).toContain(description.summary)
      expect(title).toContain(`使用例：${description.examples}`)
      expect(title).toContain(description.comparison)
      expect(screen.getByRole('img', { name: `${action.ja}（${action.name}）：0` })).toBeTruthy()
    }
    expect(screen.queryByRole('tooltip')).toBeNull()
  })
})
