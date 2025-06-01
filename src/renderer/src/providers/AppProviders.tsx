import React, { useRef, useState } from 'react'
import { IntlProvider } from 'react-intl'
import { EditorContext } from '../contexts/editorContext'
import { FocusContext } from '../contexts/FocusContext'
import { FileListContext } from '../contexts/FileListContext'
import { locale } from '../lib/locale'
import { FocusTarget } from '../types'

interface AppProvidersProps {
  children: React.ReactNode
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  const titleEditor = useRef<HTMLTextAreaElement>(null)
  const bodyEditor = useRef(null)
  const [isEditorVisible, setIsEditorVisible] = useState(true)
  const [focus, setFocus] = useState<FocusTarget>('fileList')
  const [currentListItem, setCurrentListItem] = useState<string | null>(null)
  const [current, setCurrent] = useState<string | null>(null)

  const toggleFocus = (value: FocusTarget): void => {
    if (value === focus) {
      setFocus('editor')
    } else {
      setFocus(value)
    }
  }

  return (
    <IntlProvider
      messages={locale[window.textZenInternal.config.view.locale!]}
      locale={window.textZenInternal.config.view.locale!}
    >
      <EditorContext.Provider
        value={{
          titleEditor,
          bodyEditor,
          isVisible: isEditorVisible,
          setIsVisible: setIsEditorVisible,
          current,
          setCurrent
        }}
      >
        <FocusContext.Provider
          value={{
            focus,
            setFocus,
            toggleFocus
          }}
        >
          <FileListContext.Provider
            value={{ current: currentListItem, setCurrent: setCurrentListItem }}
          >
            {children}
          </FileListContext.Provider>
        </FocusContext.Provider>
      </EditorContext.Provider>
    </IntlProvider>
  )
}
