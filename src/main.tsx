import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/app.css'
import './sheet/sheet.css'
import App from './App.tsx'
import { CharacterProvider } from './state/CharacterProvider.tsx'

const container = document.getElementById('root')
if (!container) throw new Error('#root が見つかりません。')

createRoot(container).render(
  <StrictMode>
    <CharacterProvider>
      <App />
    </CharacterProvider>
  </StrictMode>,
)
