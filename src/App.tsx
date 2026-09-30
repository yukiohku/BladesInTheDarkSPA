import { useState } from 'react'
import { APP_NAME, HARM_LEVELS, LABELS } from './constants/labels'
import { useCharacter } from './state/characterContext'
import { OfficialSheetView } from './sheet/OfficialSheetView'
import { AbilitiesTab } from './tabs/AbilitiesTab'
import { CrewTab } from './tabs/CrewTab'
import { DataTab } from './tabs/DataTab'
import { LogTab } from './tabs/LogTab'
import { SetupTab } from './tabs/SetupTab'
import { StatusTab } from './tabs/StatusTab'
import { WeaponsTab } from './tabs/WeaponsTab'

const TABS = [
  { id: 'setup', label: '初期設定', Component: SetupTab },
  { id: 'abilities', label: '特殊能力', Component: AbilitiesTab },
  { id: 'status', label: '変動記録', Component: StatusTab },
  { id: 'log', label: '履歴', Component: LogTab },
  { id: 'crew', label: 'クルー', Component: CrewTab },
  { id: 'weapons', label: '装備', Component: WeaponsTab },
  { id: 'data', label: 'データ', Component: DataTab },
] as const

type ViewMode = 'sheet' | 'edit'

export default function App() {
  const { character } = useCharacter()
  const [mode, setMode] = useState<ViewMode>('sheet')
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('setup')

  const active = TABS.find((candidate) => candidate.id === tab) ?? TABS[0]
  const Panel = active.Component

  return (
    <div className={`app${mode === 'sheet' ? ' app--sheet' : ''}`}>
      {/* シート自体にロゴがあるため、ここは細い操作バーに留める */}
      <header className="topbar">
        <div className="topbar__left">
          <span className="topbar__brand">{APP_NAME}</span>
          <span className="topbar__name">{character.basics.name || '未設定'}</span>
        </div>

        <div className="topbar__right">
          {mode === 'edit' && (
            <p className="status" role="group" aria-label="主要数値">
              <StatusItem label={LABELS.edges} value={`${character.edges}`} />
              <StatusItem
                label={LABELS.stress}
                value={`${character.stress}/${character.stressMax}`}
              />
              <StatusItem label={LABELS.harm} value={HARM_LEVELS[character.harm]} />
              <StatusItem label={LABELS.traumas} value={`${character.traumas.length}`} />
            </p>
          )}

          <div className="modes" role="group" aria-label="表示モード">
            <button
              type="button"
              className={`mode${mode === 'sheet' ? ' mode--on' : ''}`}
              aria-pressed={mode === 'sheet'}
              onClick={() => setMode('sheet')}
            >
              シート
            </button>
            <button
              type="button"
              className={`mode${mode === 'edit' ? ' mode--on' : ''}`}
              aria-pressed={mode === 'edit'}
              onClick={() => setMode('edit')}
            >
              編集
            </button>
          </div>

          {mode === 'sheet' && (
            <button type="button" className="button button--small" onClick={() => window.print()}>
              印刷
            </button>
          )}
        </div>
      </header>

      {mode === 'sheet' ? (
        <main className="main main--sheet">
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

function StatusItem({ label, value }: { label: string; value: string }) {
  return (
    <span className="status__item">
      <span className="status__label">{label}</span>
      <span className="status__value">{value}</span>
    </span>
  )
}
