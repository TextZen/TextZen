import { useEffect, useState } from 'react'

interface UseSidebarManagerReturn {
  isSidebarVisible: boolean
}

export const useSidebarManager = (): UseSidebarManagerReturn => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)

  useEffect(() => {
    window.api.getConfig('view.sidebar.visible').then((value) => {
      setIsSidebarVisible(Boolean(value))
    })
    window.electron.ipcRenderer.on('toggle-sidebar', async () => {
      const value = await window.api.getConfig('view.sidebar.visible')
      setIsSidebarVisible(Boolean(value))
    })

    return (): void => {
      window.electron.ipcRenderer.removeAllListeners('toggle-sidebar')
    }
  }, [])

  return {
    isSidebarVisible
  }
}
