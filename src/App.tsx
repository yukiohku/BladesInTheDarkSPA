import { useState } from 'react'
import { useCharacter } from './state/characterContext'
import { OfficialSheetView } from './sheet/OfficialSheetView'
import { AbilitiesTab } from './tabs/AbilitiesTab'
import { CrewTab } from './tabs/CrewTab'
import { DataTab } from './tabs/DataTab'
import { LogTab } from './tabs/LogTab'
import { OperationTab } from './tabs/OperationTab'
import { SetupTab } from './tabs/SetupTab'
import { StatusTab } from './tabs/StatusTab'
import { WeaponsTab } from './tabs/WeaponsTab'
const TABS = [
  { id: 'setup', label: '初期設定', Component: SetupTab },
  { id: 'abilities', label: '特殊能力', Component: AbilitiesTab },
  { id: 'status', label: '変動記録', Component: StatusTab },
  { id: 'weapons', label: '装備', Component: WeaponsTab },
  { id: 'operation', label: '作戦メモ', Component: OperationTab },
  { id: 'log', label: '履歴', Component: LogTab },
  { id: 'crew', label: 'クルー', Component: CrewTab },
  { id: 'data', label: 'データ', Component: DataTab },
] as const
export default function App() {
  const { storageError } = useCharacter()
  const [mode, setMode] = useState<'sheet' | 'edit'>('sheet')
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('setup')
  const Panel = (TABS.find((candidate) => candidate.id === tab) ?? TABS[0]).Component
  return (
    <div className={`app${mode === 'sheet' ? ' app--sheet' : ''}`}>
      <header className="topbar">
        <div className="modes" role="group" aria-label="表示モード">
          {(['sheet', 'edit'] as const).map((value) => (
            <button
              key={value}
              type="button"
              className={`mode${mode === value ? ' mode--on' : ''}`}
              aria-pressed={mode === value}
              onClick={() => setMode(value)}
            >
              {value === 'sheet' ? 'シート' : '編集'}
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
