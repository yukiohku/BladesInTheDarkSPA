import { useEffect, useId, useRef, useState } from 'react'
import { SUMMARY_CHAPTERS, SUMMARY_LABELS as LABELS } from '../constants/rulesSummary'
import type { SummaryChapter, SummaryChapterId } from '../constants/rulesSummary'
import logoUrl from '../assets/blades-logo.png'
import './summary.css'

type TableData = Extract<SummaryChapter['blocks'][number], { kind: 'table' }>['table']
type TabbedTables = Extract<SummaryChapter['blocks'][number], { kind: 'tabs' }>

function SummaryTable({ table, hideCaption = false }: { table: TableData; hideCaption?: boolean }) {
  return (
    <table className="rules-summary__table">
      <caption className={hideCaption ? 'rules-summary__caption--hidden' : undefined}>{table.title}</caption>
      <thead><tr>{table.headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead>
      <tbody>
        {table.rows.map(([label, description]) => (
          <tr key={label}><th scope="row">{label}</th><td>{description}</td></tr>
        ))}
      </tbody>
    </table>
  )
}

function SummaryTableTabs({ block }: { block: TabbedTables }) {
  const id = useId()
  const [selected, setSelected] = useState(() => Math.max(0, block.tables.findIndex((table) => table.tabLabel === block.initialTab)))
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  return (
    <div className="rules-summary__table-tabs">
      <div className="rules-summary__tab-heading">
        <h3>{block.title}</h3>
        <div role="tablist" aria-label={block.title}>
          {block.tables.map((table, index) => (
            <button key={table.tabLabel} type="button" role="tab" id={`${id}-tab-${index}`}
              aria-selected={index === selected} aria-controls={`${id}-panel-${index}`} tabIndex={index === selected ? 0 : -1}
              ref={(element) => { tabRefs.current[index] = element }} onClick={() => setSelected(index)}
              onKeyDown={(event) => {
                let next: number
                switch (event.key) {
                  case 'ArrowRight':
                    next = (index + 1) % block.tables.length
                    break
                  case 'ArrowLeft':
                    next = (index + block.tables.length - 1) % block.tables.length
                    break
                  case 'Home':
                    next = 0
                    break
                  case 'End':
                    next = block.tables.length - 1
                    break
                  default:
                    return
                }
                event.preventDefault()
                setSelected(next)
                tabRefs.current[next]?.focus()
              }}>{table.tabLabel}</button>
          ))}
        </div>
      </div>
      {block.tables.map((table, index) => (
        <div key={table.tabLabel} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`}
          hidden={index !== selected} tabIndex={0}>
          <SummaryTable table={table} hideCaption />
        </div>
      ))}
    </div>
  )
}

function SummaryBlock({ block }: { block: SummaryChapter['blocks'][number] }) {
  switch (block.kind) {
    case 'table':
      if (block.intro || block.paragraphs) {
        return (
          <div className="rules-summary__table-topic">
            <h3>{block.table.title}</h3>
            {block.intro && <p>{block.intro}</p>}
            <SummaryTable table={block.table} hideCaption />
            {block.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        )
      }
      return <SummaryTable table={block.table} />
    case 'tabs':
      return <SummaryTableTabs block={block} />
    case 'steps':
      return <div><h3>{block.title}</h3><ol>{block.items.map((item) => <li key={item}>{item}</li>)}</ol></div>
    case 'text':
      return <div>{block.title && <h3>{block.title}</h3>}{block.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    case 'note':
      return <aside className="rules-summary__note"><h3>{block.title}</h3><p>{block.text}</p></aside>
    case 'details':
      return <details className="rules-summary__details"><summary>{block.title}</summary>{block.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</details>
  }
}

function SummaryChapterBody({ chapter }: { chapter: SummaryChapter }) {
  const splitAt = chapter.id === 'teamwork' ? 2 : chapter.id === 'consequences' ? 4 : null
  if (splitAt !== null) {
    return (
      <div className="rules-summary__body rules-summary__body--columns">
        {[chapter.blocks.slice(0, splitAt), chapter.blocks.slice(splitAt)].map((blocks, columnIndex) => (
          <div key={columnIndex} className="rules-summary__column">
            {blocks.map((block, blockIndex) => <SummaryBlock key={blockIndex} block={block} />)}
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className={`rules-summary__body${chapter.id === 'roll' ? ' rules-summary__body--roll' : ''}`}>
      {chapter.blocks.map((block, blockIndex) => <SummaryBlock key={blockIndex} block={block} />)}
    </div>
  )
}

export function RulesSummaryView() {
  const chapterRefs = useRef<Partial<Record<SummaryChapterId, HTMLHeadingElement>>>({})
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [])
  const moveTo = (heading: HTMLHeadingElement | null | undefined) => {
    heading?.focus({ preventScroll: true })
    heading?.scrollIntoView({ block: 'start' })
  }
  return (
    <div className="rules-summary">
      <header className="rules-summary__intro">
        <div className="rules-summary__banner">
          <img className="rules-summary__logo" src={logoUrl} alt="Blades in the Dark" />
          <div>
            <p className="rules-summary__eyebrow">RULES SUMMARY</p>
            <h1>{LABELS.title}</h1>
          </div>
        </div>
      </header>
      <div className="rules-summary__layout">
        <nav className="rules-summary__contents" aria-label={LABELS.contents}>
          <h2>{LABELS.contentsTitle}</h2>
          <ol>
            {SUMMARY_CHAPTERS.map((chapter, index) => (
              <li key={chapter.id}>
                <button type="button" onClick={() => moveTo(chapterRefs.current[chapter.id])} aria-controls={`summary-${chapter.id}`}>
                  <span aria-hidden="true">0{index + 1}</span>{chapter.title}
                </button>
              </li>
            ))}
          </ol>
        </nav>
        <div className="rules-summary__chapters">
          {SUMMARY_CHAPTERS.map((chapter, index) => (
            <section key={chapter.id} id={`summary-${chapter.id}`} aria-labelledby={`summary-${chapter.id}-title`}
              className={`rules-summary__chapter${['roll', 'teamwork', 'consequences'].includes(chapter.id) ? ' rules-summary__chapter--wide' : ''}`}>
              <header className="rules-summary__chapter-heading">
                <span aria-hidden="true">0{index + 1}</span>
                <h2 id={`summary-${chapter.id}-title`} tabIndex={-1} ref={(element) => {
                  if (element) chapterRefs.current[chapter.id] = element
                  else delete chapterRefs.current[chapter.id]
                }}>{chapter.title}</h2>
              </header>
              <SummaryChapterBody chapter={chapter} />
            </section>
          ))}
          <footer className="rules-summary__attribution">
            <h2>{LABELS.attributionTitle}</h2>
            <p>{LABELS.attribution}</p>
            <p><a href="https://bladesinthedark.com/" target="_blank" rel="noreferrer">Blades in the Dark</a> · <a href="https://bladesinthedark.com/licensing" target="_blank" rel="noreferrer">SRD利用案内</a> · <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noreferrer">CC BY 3.0 Unported</a></p>
          </footer>
        </div>
      </div>
    </div>
  )
}
