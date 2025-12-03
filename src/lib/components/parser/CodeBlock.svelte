<script lang="ts">
  import * as monacoEditor from 'monaco-editor'

  import { MONACO_DARK_THEME, MONACO_LIGHT_THEME } from '$lib/constants/monaco'
  import { theme, Theme } from '$lib/services/themeService'

  import { CopyBtn } from '$components/common/buttons'

  let { value, lang } = $props()
  let content = $state()

  $effect(() => {
    monacoEditor.editor.defineTheme('custom-dark', MONACO_DARK_THEME)
    monacoEditor.editor.defineTheme('custom-light', MONACO_LIGHT_THEME)
    monacoEditor.editor.setTheme($theme === Theme.Dark ? 'custom-dark' : 'custom-light')

    if (value) {
      monacoEditor.editor.colorize(value, lang, { tabSize: 2 }).then((data) => {
        content = data
      })
    }
  })

  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value)
    }
  }
</script>

<div class="relative codeBlock">
  <div class="mt-2 p-3! w-full code bg-pageBg!">
    {@html content ?? value}
  </div>

  <CopyBtn
    className="absolute top-2 right-2 text-textSub600"
    onClick={handleCopy}
  />
</div>

<style lang="postcss">
  .codeBlock {
    :global {
      .copyBtn {
        display: none !important;

        svg {
          fill: none !important;
        }
      }
    }

    &:hover {
      :global {
        .copyBtn {
          display: flex !important;
        }
      }
    }
  }
</style>
