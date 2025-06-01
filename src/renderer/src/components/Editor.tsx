import BodyField from './BodyField'
import TitleField from './TitleField'
import { useContext, memo, useCallback } from 'react'
import { File } from '../types'
import { EditorContext } from '@renderer/contexts/editorContext'
import { FocusContext } from '@renderer/contexts/FocusContext'
import { useEditorState } from '../hooks/useEditorState'
import { useEditorKeyboard } from '../hooks/useEditorKeyboard'
import { useEditorFileSync } from '../hooks/useEditorFileSync'

interface Props {
  currentFile: File
  onTitleChange: (value: string) => void
  files: Array<File>
  setCurrentTitle: (value: string) => void
  currentTitle: string
  onBodyChange: (value: string) => void
}

const Editor = memo(function Editor({
  currentFile,
  onTitleChange,
  files,
  setCurrentTitle,
  currentTitle,
  onBodyChange
}: Props): JSX.Element {
  const { bodyEditor, titleEditor } = useContext(EditorContext)
  const { setFocus } = useContext(FocusContext)

  const { editorVisible, currentBody, setCurrentBody } = useEditorState(
    currentFile,
    setCurrentTitle
  )

  const { handleTitleKeyDown, handleBodyKeyDownCapture } = useEditorKeyboard({
    titleEditor,
    bodyEditor,
    currentBody,
    setCurrentBody
  })

  const { handleUpdate, handleTitleChange: handleFileTitleChange } = useEditorFileSync({
    currentFile,
    currentTitle,
    currentBody,
    setCurrentBody,
    onBodyChange,
    files
  })

  const handleTitleChange = useCallback(
    (value: string): void => {
      setCurrentTitle(value)
      handleFileTitleChange(value)
      onTitleChange(value)
    },
    [setCurrentTitle, handleFileTitleChange, onTitleChange]
  )

  return (
    <div className="editor" onClick={() => setFocus('editor')}>
      <TitleField
        value={currentTitle || ''}
        onChange={handleTitleChange}
        onKeyDown={handleTitleKeyDown}
      />
      {editorVisible && (
        <BodyField
          value={currentBody}
          onChange={handleUpdate}
          file={currentFile}
          onKeyDownCapture={handleBodyKeyDownCapture as (keyboardEvent) => void}
        />
      )}
    </div>
  )
})

export default Editor
