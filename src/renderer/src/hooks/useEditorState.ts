import { useEffect, useState } from 'react'
import { File } from '../types'

export const useEditorState = (
  currentFile: File | null,
  setCurrentTitle: (title: string | null) => void
): {
  editorVisible: boolean
  currentBody: string
  setCurrentBody: (body: string) => void
} => {
  const [editorVisible, setEditorVisible] = useState(true)
  const [currentBody, setCurrentBody] = useState('')

  useEffect(() => {
    if (!currentFile) {
      return
    }
    window.api.getBody(currentFile.id).then(setCurrentBody)
    setEditorVisible(false)
    setTimeout(() => setEditorVisible(true), 1)
  }, [currentFile, setCurrentTitle])

  useEffect(() => {
    if (currentFile) {
      setCurrentTitle(currentFile.title)
    }
  }, [currentFile?.title, setCurrentTitle])

  return {
    editorVisible,
    currentBody,
    setCurrentBody
  }
}
