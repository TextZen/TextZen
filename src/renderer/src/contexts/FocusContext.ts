import { createContext, Dispatch, SetStateAction } from 'react'
import { FocusTarget } from '../types'

interface FocusContextType {
  focus: FocusTarget
  setFocus: Dispatch<SetStateAction<FocusTarget>>
  toggleFocus: (value: FocusTarget) => void
}

export const FocusContext = createContext<FocusContextType>({
  focus: 'fileList',
  setFocus: () => {},
  toggleFocus: () => {}
})
