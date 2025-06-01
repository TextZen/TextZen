import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { File } from '../types'
import { ReactCodeMirrorRef } from '@uiw/react-codemirror'

interface UseLocationManagerProps {
  bodyEditor: React.RefObject<ReactCodeMirrorRef> | null
  allFiles: File[]
  current: string | null
  isDeleted: boolean
  setCurrent: (id: string | null) => void
  setCurrentFile: (file: File | null) => void
  setCurrentTitle: (title: string | null) => void
  setIsDeleted: (deleted: boolean) => void
  setFocus: (focus: string) => void
  handleCreate: (title?: string | null, body?: string | null) => Promise<void>
  toggleFocus: (focus: string) => void
}

export const useLocationManager = ({
  bodyEditor,
  allFiles,
  current,
  isDeleted,
  setCurrent,
  setCurrentFile,
  setCurrentTitle,
  setIsDeleted,
  setFocus,
  handleCreate,
  toggleFocus
}: UseLocationManagerProps): void => {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.state?.line) {
      setTimeout(() => {
        const linePos = bodyEditor?.current?.view?.state.doc.line(location.state.line)
        if (linePos) {
          bodyEditor?.current?.view?.focus()
          bodyEditor?.current?.view?.dispatch({
            selection: { anchor: linePos.from, head: linePos.from },
            scrollIntoView: true
          })
        }
      }, 50)
    }
  }, [bodyEditor, location])

  useEffect(() => {
    const file = location.state
      ? allFiles.find((f) => {
          return f.title === location.state.title
        }) || null
      : null
    if (allFiles.length > 0 && !file && location.pathname.match('notes') && !isDeleted) {
      handleCreate(location.state.title)
      return
    }
    setCurrent(file?.id || null)
    setCurrentFile(file)
    if (file?.id !== current) {
      setCurrentTitle(file?.title || null)
    }
  }, [
    location.state,
    allFiles,
    handleCreate,
    location.pathname,
    isDeleted,
    current,
    setCurrent,
    setCurrentFile,
    setCurrentTitle
  ])

  useEffect(() => {
    setIsDeleted(false)
  }, [location, setIsDeleted])

  useEffect(() => {
    if (location.state?.force) {
      setFocus('editor')
      setTimeout(() => {
        bodyEditor?.current?.view?.focus()
      }, 100)
    }
  }, [bodyEditor, location, setFocus])

  useEffect(() => {
    window.electron.ipcRenderer.on('toggle-search-full-text', () => {
      toggleFocus('fullTextSearch')
      document.querySelector('article')!.scrollTo(0, 0)
    })

    window.electron.ipcRenderer.on('search-file', () => {
      toggleFocus('fileSearch')
    })

    window.electron.ipcRenderer.on('replace', async (_, title) => {
      navigate(`/files/${title}`, {
        replace: true,
        state: { title }
      })
    })

    return (): void => {
      window.electron.ipcRenderer.removeAllListeners('toggle-search-full-text')
      window.electron.ipcRenderer.removeAllListeners('search-file')
      window.electron.ipcRenderer.removeAllListeners('replace')
    }
  }, [navigate, toggleFocus])
}
