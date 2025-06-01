import { createContext, Dispatch, SetStateAction } from 'react'

interface FileListContextType {
  current: string | null
  setCurrent: Dispatch<SetStateAction<string | null>>
}

export const FileListContext = createContext<FileListContextType>({
  current: null,
  setCurrent: () => {}
})
