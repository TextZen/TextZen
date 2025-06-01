export interface File {
  id: string
  title: string
  mtime: number
}

export type FocusTarget = 'fileList' | 'editor' | 'fullTextSearch' | 'fileSearch'

export interface EditorRef {
  titleEditor: React.RefObject<HTMLTextAreaElement>
  bodyEditor: React.RefObject<import('@uiw/react-codemirror').ReactCodeMirrorRef>
}

export interface Config {
  view: {
    locale: string
    theme: string
    sidebar: {
      visible: boolean
      width: number
    }
  }
  general: {
    path: string
  }
  edit: {
    autoSave: boolean
  }
}

export interface WindowAPI {
  api: {
    getFiles: () => Promise<File[]>
    getBody: (id: string) => Promise<string>
    writeFile: (title: string, body: string, id: string) => Promise<boolean>
    createFile: (title: string, body?: string | null) => Promise<File>
    deleteFile: (id: string) => Promise<boolean>
    copyFile: (file: globalThis.File) => Promise<void>
    getConfig: (key: string) => Promise<string | number | boolean>
    setConfig: (key: string, value: string | number | boolean) => void
  }
  electron: {
    ipcRenderer: {
      on: (channel: string, listener: (...args: unknown[]) => void) => void
      send: (channel: string, ...args: unknown[]) => void
      removeAllListeners: (channel: string) => void
    }
  }
  textZenInternal: {
    config: Config
    files: File[]
  }
  textZen: {
    codemirror: {
      view?: unknown
      state?: unknown
      editor?: unknown
    }
  }
  EditContext: boolean
}
