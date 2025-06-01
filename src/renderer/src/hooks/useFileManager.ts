import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { File } from '../types'

interface UseFileManagerReturn {
  files: File[]
  allFiles: File[]
  currentFile: File | null
  currentTitle: string | null
  isDeleted: boolean
  setCurrentTitle: (title: string | null) => void
  setCurrentFile: (file: File | null) => void
  setIsDeleted: (deleted: boolean) => void
  handleCreate: (title?: string | null, body?: string | null) => Promise<void>
  handleTitleChange: (title: string) => void
  handleBodyChange: () => void
  init: () => Promise<void>
}

export const useFileManager = (
  titleEditor: React.RefObject<HTMLTextAreaElement> | null,
  current: string | null,
  setCurrent: (id: string | null) => void,
  setFocus: (focus: string) => void
): UseFileManagerReturn => {
  const navigate = useNavigate()
  const [files, setFiles] = useState<File[]>([])
  const [allFiles, setAllFiles] = useState<File[]>([])
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [currentTitle, setCurrentTitle] = useState<string | null>(null)
  const [isDeleted, setIsDeleted] = useState(false)

  const handleCreate = useCallback(
    async (t: string | null = null, body: string | null = null): Promise<void> => {
      let title: string | null = t
      let counter = 0
      if (!t) {
        do {
          title = counter === 0 ? 'Untitled' : `Untitled${counter}`
          counter++
        } while (files.map((f) => f.title).includes(title))
      }
      const result = await window.api.createFile(title, body)
      setFiles([result, ...files])
      setAllFiles([result, ...files])
      await navigate(`/files/${result.title}`, {
        replace: true,
        state: { title: result.title }
      })
      setTimeout(() => titleEditor?.current?.select(), 50)
      setFocus('editor')
    },
    [files, navigate, setFocus, titleEditor]
  )

  const init = useCallback(async (): Promise<void> => {
    window.api
      .getFiles()
      .then(async (fs) => {
        setFiles(fs)
        setAllFiles(fs)
        window.textZenInternal.files = fs
      })
      .catch(() => {
        navigate('/setup', { replace: true })
      })
  }, [navigate])

  const handleTitleChange = (title: string): void => {
    if (!currentFile) {
      return
    }
    const f = files.find((f) => f.id === currentFile.id)!
    setFiles([{ ...f, title }, ...files.filter((f) => f.id !== currentFile.id)])
  }

  const handleBodyChange = (): void => {
    if (!currentFile) {
      return
    }
    const f = files.find((f) => f.id === currentFile.id)!
    setFiles([f, ...files.filter((f) => f.id !== currentFile.id)])
  }

  useEffect(() => {
    const unsubscribeAdd = (): void => {
      window.electron.ipcRenderer.on('file-event:add', async () => {
        init()
      })
    }

    const unsubscribeDelete = (): void => {
      window.electron.ipcRenderer.on('delete-file', async (_, id) => {
        const result = await window.api.deleteFile(id)
        if (result) {
          setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id))
          setAllFiles((prevFiles) => prevFiles.filter((file) => file.id !== id))
          if (id === current) {
            setCurrentFile(null)
            setCurrent(null)
            setIsDeleted(true)
            return
          }
        }
      })
    }

    const unsubscribeNew = (): void => {
      window.electron.ipcRenderer.on('new', () => {
        handleCreate()
      })
    }

    const unsubscribeDuplicate = (): void => {
      window.electron.ipcRenderer.on('duplicate', (_, title) => {
        handleCreate(`${title}のコピー`)
      })
    }

    const unsubscribeOpenFile = (): void => {
      window.electron.ipcRenderer.on('open-file', (_, title, body) => {
        if (files.map((file) => file.title).includes(title)) {
          navigate(`/files/${title}`, { state: { title } })
        } else {
          handleCreate(title, body)
        }
      })
    }

    unsubscribeAdd()
    unsubscribeDelete()
    unsubscribeNew()
    unsubscribeDuplicate()
    unsubscribeOpenFile()

    return (): void => {
      window.electron.ipcRenderer.removeAllListeners('file-event:add')
      window.electron.ipcRenderer.removeAllListeners('delete-file')
      window.electron.ipcRenderer.removeAllListeners('new')
      window.electron.ipcRenderer.removeAllListeners('duplicate')
      window.electron.ipcRenderer.removeAllListeners('open-file')
    }
  }, [current, currentFile, files, handleCreate, init, navigate, setCurrent])

  return {
    files,
    allFiles,
    currentFile,
    currentTitle,
    isDeleted,
    setCurrentTitle,
    setCurrentFile: setCurrentFile,
    setIsDeleted: setIsDeleted,
    handleCreate,
    handleTitleChange,
    handleBodyChange,
    init
  }
}
