<script lang="ts">
  import { mount } from 'svelte'

  import CodeBlock from './CodeBlock.svelte'

  interface Props {
    content: string
  }

  let container = $state<HTMLDivElement>()
  let { content }: Props = $props()

  const registry = {
    CustomCode: CodeBlock
  }

  const hydrateCustomComponents = () => {
    Object.entries(registry).forEach(([tag, Component]) => {
      container
        ?.querySelectorAll(tag)
        .forEach((el) => {
          const target = document.createElement('div')

          const props = Array.from(el.attributes).reduce((acc: Record<string, any>, attr) => {
            if (attr.name === 'value') {
              acc[attr.name] = decodeURIComponent(attr.value)
            } else {
              acc[attr.name] = attr.value
            }

            return acc
          }, {})

          el.replaceWith(target)
          mount(Component, { target, props })
        })
    })
  }

  $effect(() => {
    if (container && content) {
      hydrateCustomComponents()
    }
  })
</script>

<div
  bind:this={container}
  class="md-html"
>
  {@html content}
</div>
