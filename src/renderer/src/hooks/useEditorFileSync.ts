import { useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { File } from '../types'

interface UseEditorFileSyncProps {
  currentFile: File
  currentTitle: string
  currentBody: string
  setCurrentBody: (body: string) => void
  onBodyChange: (value: string) => void
  files: File[]
}

export const useEditorFileSync = ({
  currentFile,
  currentTitle,
  currentBody,
  setCurrentBody,
  onBodyChange,
  files
}: UseEditorFileSyncProps): {
  handleUpdate: (value: string) => void
  handleTitleChange: (value: string) => void
} => {
  const writeFile = useDebouncedCallback(async (title: string, body: string, target: string) => {
    const result = window.api.writeFile(title, body, target)
    if (!result) {
      return
    }
  }, 500)

  useEffect(() => {
    const handleFileChange = async (_: unknown, id: string, newId: string): Promise<void> => {
      if (id === currentFile.id) {
        const body = await window.api.getBody(newId)
        setCurrentBody(body)
      }
    }

    window.electron.ipcRenderer.on('file-event:change', handleFileChange)

    return (): void => {
      window.electron.ipcRenderer.removeAllListeners('file-event:change')
    }
  }, [currentFile.id, setCurrentBody])

  const handleUpdate = (value: string): void => {
    if (files.find((f) => f !== currentFile && f.title === currentFile?.title)) {
      return
    }
    writeFile(currentTitle, value, currentFile.id)
    setCurrentBody(value)
    onBodyChange(value)
  }

  const handleTitleChange = (value: string): void => {
    let title = value
    if (!title) {
      let counter = 0
      do {
        title = counter === 0 ? 'Untitled' : `Untitled${counter}`
        counter++
      } while (files.find((f) => f.title === title))
    }

    writeFile(title, currentBody, currentFile.id)
  }

  return {
    handleUpdate,
    handleTitleChange
  }
}
