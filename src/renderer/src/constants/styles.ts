export const CSS_CLASSES = {
  // Layout
  editor: 'editor',
  sidebar: 'sidebar',
  header: 'header',
  main: 'main',
  article: 'article',

  // File list
  fileList: 'fl',
  fileItem: 'fi',
  fileItemActive: 'fi--active',

  // Header
  headerTitle: 'header-title',
  headerTitleRight: 'header-title--r',
  headerButtons: 'header-btns',

  // Sidebar
  sidebarHeader: 's-h',

  // Empty page
  emptyPage: 'ep',
  container: 'container',

  // Buttons
  iconButton: 'i-button',
  textButton: 't-button',

  // Keyboard
  keyboard: 'keyboard',

  // Utilities
  shadow: 'shadow-sm',

  // Focus states
  focused: 'focused'
} as const

export const FOCUS_CLASSES = {
  fileList: 'focus-file-list',
  editor: 'focus-editor',
  search: 'focus-search'
} as const
