import { useContext, useEffect } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import Editor from './Editor'
import { FormattedMessage } from 'react-intl'
import { FullTextSearch } from './FullTextSearch'
import { EditorContext } from '@renderer/contexts/editorContext'
import { FocusContext } from '@renderer/contexts/FocusContext'
import FileSearch from './FileSearch'
import { useFileManager } from '../hooks/useFileManager'
import { useLocationManager } from '../hooks/useLocationManager'
import { useSidebarManager } from '../hooks/useSidebarManager'

export default function Page(): JSX.Element {
  const { titleEditor, bodyEditor, current, setCurrent } = useContext(EditorContext)
  const { focus, setFocus, toggleFocus } = useContext(FocusContext)

  const {
    files,
    allFiles,
    currentFile,
    currentTitle,
    isDeleted,
    setCurrentTitle,
    setCurrentFile,
    setIsDeleted,
    handleCreate,
    handleTitleChange,
    handleBodyChange,
    init
  } = useFileManager(titleEditor, current, setCurrent, setFocus)

  const { isSidebarVisible } = useSidebarManager()

  useLocationManager({
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
  })

  useEffect(() => {
    init()

    window.electron.ipcRenderer.on('open-directory', init)

    return (): void => {
      window.electron.ipcRenderer.removeAllListeners('open-directory')
    }
  }, [init])

  return (
    <>
      <main>
        <Sidebar files={files} isVisible={isSidebarVisible} />
        <article>
          <Header
            isSidebarVisible={isSidebarVisible}
            title={focus !== 'fullTextSearch' ? currentTitle || '' : ''}
            onCreate={() => handleCreate()}
          />
          <FileSearch files={files}></FileSearch>
          <FullTextSearch currentTitle={currentTitle}></FullTextSearch>
          {focus !== 'fullTextSearch' && (
            <>
              {currentFile ? (
                <Editor
                  currentFile={currentFile}
                  currentTitle={currentTitle || ''}
                  setCurrentTitle={setCurrentTitle}
                  files={allFiles}
                  onTitleChange={handleTitleChange}
                  onBodyChange={handleBodyChange}
                />
              ) : (
                <div className="ep">
                  <div className="container">
                    <button type="button" onClick={() => handleCreate()} className="t-button">
                      <FormattedMessage id="add" />
                    </button>
                    <div className="shortcut">
                      <div className="keyboard">⌘</div>
                      <div className="keyboard">N</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </article>
      </main>
    </>
  )
}
