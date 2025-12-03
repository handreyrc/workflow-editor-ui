import type monacoEditor from 'monaco-editor'

export const MONACO_DARK_THEME: monacoEditor.editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  colors: {
    'editor.background': '#222530',
  },
  rules: []
}

export const MONACO_LIGHT_THEME: monacoEditor.editor.IStandaloneThemeData = {
  base: 'vs',
  inherit: true,
  colors: {
    'editor.background': '#F8F8F8',
  },
  rules: []
}
