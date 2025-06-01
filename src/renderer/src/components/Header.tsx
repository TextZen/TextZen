import { useIntl } from 'react-intl'
import { useContext, useEffect, useState, memo, useCallback } from 'react'
import { FocusContext } from '@renderer/contexts/FocusContext'
import { MaterialSymbol } from 'react-material-symbols'
import 'react-material-symbols/rounded'
import { useLocation } from 'react-router'
import { CSS_CLASSES } from '../constants/styles'

const Header = memo(function Header({
  onCreate,
  title,
  isSidebarVisible
}: {
  title: string
  onCreate?: () => void
  isSidebarVisible: boolean
}): JSX.Element {
  const intl = useIntl()
  const { toggleFocus } = useContext(FocusContext)

  const handleCreateClick = useCallback(() => {
    onCreate?.()
  }, [onCreate])

  const handleFileSearchClick = useCallback(() => {
    toggleFocus('fileSearch')
  }, [toggleFocus])

  const handleFullTextSearchClick = useCallback(() => {
    toggleFocus('fullTextSearch')
  }, [toggleFocus])
  const [folder, setFolder] = useState('')
  const location = useLocation()

  useEffect(() => {
    window.api.getConfig('general.path').then((path) => {
      setFolder(path.split('/').pop()!)
    })
  })

  return (
    <header className={CSS_CLASSES.header}>
      {location.pathname !== '/setup' && (
        <>
          <div
            className={`${CSS_CLASSES.headerTitle} ${isSidebarVisible ? '' : CSS_CLASSES.headerTitleRight}`}
          >
            <h2 className="folder">{folder}</h2>
            <h3 className="file">{title}</h3>
          </div>
          <div className={CSS_CLASSES.headerButtons}>
            <button
              type="button"
              className={CSS_CLASSES.iconButton}
              onClick={handleCreateClick}
              aria-label={intl.formatMessage({ id: 'add' })}
            >
              <MaterialSymbol weight={300} icon="add" size={22} />
            </button>

            <button
              type="button"
              className={CSS_CLASSES.iconButton}
              onClick={handleFileSearchClick}
              aria-label={intl.formatMessage({ id: 'searchFile' })}
            >
              <MaterialSymbol weight={300} icon="manage_search" size={22} />
            </button>

            <button
              type="button"
              className={CSS_CLASSES.iconButton}
              onClick={handleFullTextSearchClick}
              aria-label={intl.formatMessage({ id: 'searchFullText' })}
            >
              <MaterialSymbol weight={300} icon="search" size={22} />
            </button>
          </div>
        </>
      )}
    </header>
  )
})

export default Header
