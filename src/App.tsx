import { useState } from 'react'
import { useCharacter } from './state/characterContext'
import { OfficialSheetView } from './sheet/OfficialSheetView'
import { VIEW_MODES } from './constants/labels'
import { RulesSummaryView } from './summary/RulesSummaryView'
import { AbilitiesTab } from './tabs/AbilitiesTab'
import { DataTab } from './tabs/DataTab'
import { SetupTab } from './tabs/SetupTab'
import { StatusTab } from './tabs/StatusTab'
import { WeaponsTab } from './tabs/WeaponsTab'
const TABS = [
  { id: 'setup', label: '初期設定', Component: SetupTab },
  { id: 'abilities', label: '特殊能力', Component: AbilitiesTab },
  { id: 'status', label: '状態', Component: StatusTab },
  { id: 'weapons', label: '装備', Component: WeaponsTab },
  { id: 'data', label: 'データ', Component: DataTab },
] as const
export default function App() {
  const { storageError } = useCharacter()
  const [mode, setMode] = useState<(typeof VIEW_MODES)[number]['id']>('sheet')
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('setup')
  const Panel = (TABS.find((candidate) => candidate.id === tab) ?? TABS[0]).Component
  return (
    <div className={`app${mode === 'sheet' ? ' app--sheet' : mode === 'summary' ? ' app--summary' : ''}`}>
      <header className="topbar">
        <div className="modes" role="group" aria-label="表示モード">
          {VIEW_MODES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`mode${mode === id ? ' mode--on' : ''}`}
              aria-pressed={mode === id}
              onClick={() => setMode(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </header>
      {storageError && (
        <p role="alert" className="field__error">
          {storageError}
        </p>
      )}
      {mode === 'sheet' ? (
        <main
          className="main main--sheet"
          tabIndex={0}
          aria-label="プレイシート（横スクロールできます）"
        >
          <OfficialSheetView />
        </main>
      ) : mode === 'summary' ? (
        <main className="main main--summary" aria-label="ルールサマリー">
          <RulesSummaryView />
        </main>
      ) : (
        <>
          <nav className="tabs" aria-label="シートのセクション">
            {TABS.map((candidate) => (
              <button
                key={candidate.id}
                type="button"
                className={`tab${candidate.id === tab ? ' tab--on' : ''}`}
                aria-current={candidate.id === tab ? 'page' : undefined}
                onClick={() => setTab(candidate.id)}
              >
                {candidate.label}
              </button>
            ))}
          </nav>
          <main className="main">
            <Panel />
          </main>
        </>
      )}
    </div>
  )
}
