import { useCallback } from 'react'
import { ReactCodeMirrorRef } from '@uiw/react-codemirror'

interface UseEditorKeyboardProps {
  titleEditor: React.RefObject<HTMLTextAreaElement> | null
  bodyEditor: React.RefObject<ReactCodeMirrorRef> | null
  currentBody: string
  setCurrentBody: (body: string) => void
}

export const useEditorKeyboard = ({
  titleEditor,
  bodyEditor,
  currentBody,
  setCurrentBody
}: UseEditorKeyboardProps): {
  handleTitleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  handleBodyKeyDownCapture: (e: KeyboardEvent) => void
} => {
  const handleTitleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.isComposing || e.key === 'Process' || e.keyCode === 229) {
        return
      }
      if (e.keyCode === 13) {
        e.preventDefault()
        bodyEditor?.current?.view?.focus()
        setCurrentBody(`\n${currentBody}`)
      }
      if (e.key === 'ArrowDown' || (e.ctrlKey && e.key == 'n')) {
        e.preventDefault()
        bodyEditor?.current?.view?.focus()
      }
    },
    [bodyEditor, currentBody, setCurrentBody]
  )

  const handleBodyKeyDownCapture = useCallback(
    (e: KeyboardEvent): void => {
      if (e.isComposing || e.key === 'Process' || e.keyCode === 229) {
        return
      }
      if (e.key === 'ArrowUp' || (e.ctrlKey && e.key == 'p')) {
        const view = bodyEditor?.current?.view
        if (!view) return

        const line = view.state.doc.lineAt(view.state.selection.main.head)

        if (line.number === 1) {
          e.preventDefault()
          titleEditor?.current?.focus()
          titleEditor?.current?.setSelectionRange(
            titleEditor?.current.value.length,
            titleEditor?.current.value.length
          )
        }
      }
    },
    [bodyEditor, titleEditor]
  )

  return {
    handleTitleKeyDown,
    handleBodyKeyDownCapture
  }
}
