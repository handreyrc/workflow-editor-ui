<script lang="ts">
  import type monacoEditor from 'monaco-editor'
  import * as monaco from 'monaco-editor'
  import 'monaco-editor/min/vs/editor/editor.main.css'
  import { onDestroy, onMount } from 'svelte'
  import { type Writable, writable } from 'svelte/store'

  import { MONACO_DARK_THEME, MONACO_LIGHT_THEME } from '$lib/constants/monaco'
  import { Theme, theme } from '$lib/services/themeService'
  import type { Maybe } from '$lib/types'

  interface Props {
    value?: Writable<string> | string
    language?: string
    options?: monacoEditor.editor.IStandaloneEditorConstructionOptions
    onEditorMount?: (editor: monacoEditor.editor.IStandaloneCodeEditor) => void
    onChange?: (value: string) => void
  }

  let {
    value = writable(''),
    language = 'json',
    options = {},
    onChange,
    onEditorMount
  }: Props = $props()

  let editor: monacoEditor.editor.IStandaloneCodeEditor
  let container: Maybe<HTMLDivElement> = $state()
  const writableValue = typeof value === 'string' ? writable(value) : value

  theme.subscribe((value) => {
    monaco?.editor?.setTheme(value === Theme.Dark ? 'custom-dark' : 'custom-light')
  })

  onMount(async () => {
    monaco.editor.defineTheme('custom-dark', MONACO_DARK_THEME)
    monaco.editor.defineTheme('custom-light', MONACO_LIGHT_THEME)
    monaco.editor.setTheme($theme === Theme.Dark ? 'custom-dark' : 'custom-light')

    const opts = {
      scrollbar: {
        alwaysConsumeMouseWheel: false
      },
      ...options,
    }

    if (container) {
      editor = monaco.editor.create(container, {
        value: $writableValue,
        language,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        fontFamily: 'Source Code Pro, monospace',
        ...opts
      })

      editor.onDidChangeModelContent(() => {
        const val = editor.getValue()
        writableValue.set(val)
        onChange?.(val)
      })

      onEditorMount?.(editor)
    }
  })

  onDestroy(() => {
    editor?.dispose()
  })
</script>

<div class="h-full w-full" bind:this={container}></div>


