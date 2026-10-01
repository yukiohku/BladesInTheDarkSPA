import { useEffect, useId, useRef } from 'react'
import { ABILITY_LABELS } from '../constants/labels'

export function AbilityRemovalDialog({
  name,
  message,
  onConfirm,
  onCancel,
}: {
  name: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const messageId = useId()
  useEffect(() => {
    ref.current?.showModal()
  }, [])
  const cancel = () => {
    ref.current?.close()
    onCancel()
  }
  return (
    <dialog
      ref={ref}
      className="ability-removal-dialog"
      aria-label={`${name}の${ABILITY_LABELS.remove}`}
      aria-describedby={messageId}
      onCancel={(event) => {
        event.preventDefault()
        cancel()
      }}
    >
      <p id={messageId} className="ability-removal-dialog__message">{message}</p>
      <div className="ability-removal-dialog__actions">
        <button type="button" className="button" autoFocus onClick={cancel}>
          {ABILITY_LABELS.cancel}
        </button>
        <button
          type="button"
          className="button button--danger"
          onClick={() => {
            ref.current?.close()
            onConfirm()
          }}
        >
          {ABILITY_LABELS.confirmRemoval}
        </button>
      </div>
    </dialog>
  )
}
