<script lang="ts">
  import { type Writable, writable } from 'svelte/store'

  import { page } from '$app/state'
  import { getStores } from '$app/stores'

  import { Theme, theme } from '$lib/services/themeService'

  import Tooltip from '$components/common/ui/Tooltip.svelte'
  import { GenFusionIcon } from '$components/icons/tools'
  import ProfileMenu from '$components/header/ProfileMenu.svelte'

  import togglesidemenuright from '$assets/images/togglesidemenuright.svg'
  import contentLogo from '$assets/images/contentLogo.svg'
  import foldersLogo from '$assets/images/foldersLogo.svg'
  import toolsLineLogo from '$assets/images/toolsLineLogo.svg'
  import prompt from '$assets/images/prompt.svg'
  import help from '$assets/images/help.svg'

  interface Props {
    isExpanded?: Writable<boolean>
  }

  let {
    isExpanded = writable(false)
  }: Props = $props()

  const toggleSidebar = () => {
    isExpanded.update((v) => !v)
  }

  let activeItem = $state('task')

  const getCurrentPage = (path: string) => {
    if (path.startsWith('/task')) return 'task'
    if (path.startsWith('/project')) return 'projects'
    if (path.startsWith('/tool')) return 'tools'
    if (path.startsWith('/model')) return 'model'
    if (path === '/') return 'content'
    return 'archive'
  }

  getStores().page.subscribe((value) => {
    const path = value.url.pathname
    activeItem = getCurrentPage(path)
  })

  const navItems = [
    { label: 'Dashboard', href: '/', key: 'content', icon: contentLogo },
    { label: 'My Tasks', href: '/task', key: 'task', icon: prompt },
    { label: 'Projects', href: '/project', key: 'projects', icon: foldersLogo },
    { label: 'Credentials', href: '/tool', key: 'tools', icon: toolsLineLogo }
  ]
</script>

<div
  class="navWrapper"
  class:isExpanded={$isExpanded}
>
  <button
    onclick={toggleSidebar}
    id="toggle-sidemenu"
    class="absolute top-[32px] right-0 p-2 translate-x-[50%]"
  >
    <img
      src={togglesidemenuright}
      alt="toggle sidebar"
      class:rotate-180={$isExpanded}
      class="transition-transform duration-300"
    />
  </button>

  <a href="/" class="flex items-center p-1 text-primaryBase">
    <span class="w-8 h-8 center shrink-0"><GenFusionIcon width={20} height={20} /></span>
    {#if $isExpanded}
      <span class="text-2xl ml-2 overflow-hidden">GenFusion</span>
    {/if}
  </a>

  <div class="flex flex-col gap-2">
    {#each navItems as item}
      <Tooltip
        content={!$isExpanded ? item.label : ''}
        positioning={{
          placement: 'right',
        }}
      >
        <a
          href={item.href}
          class="nav__item"
          class:isSelected={activeItem === item.key}
        >
          <img
            src={item.icon}
            class="w-5 h-5 shrink-0"
            class:invert={$theme === Theme.Light && activeItem !== item.key}
            alt={item.label}
          />
          {#if $isExpanded}
            <span class="overflow-hidden text-nowrap">{item.label}</span>
          {/if}
        </a>
      </Tooltip>
    {/each}
  </div>

  <div class="grow"></div>

  <a
    href="/help"
    class="flex items-center text-sm text-textStrong950 transition-colors rounded-xs cursor-pointer hover:bg-fadedLight"
  >
    <div class="w-9 h-9 center shrink-0">
      <img src={help} alt="Help" class="w-4 h-4" />
    </div>
    {#if $isExpanded}
      <span>Help</span>
    {/if}
  </a>

  <ProfileMenu isExpanded={$isExpanded} />
</div>

<style lang="postcss">
  @reference "$lib/styles/tailwind.css";

  .navWrapper {
    @apply fixed z-40 h-screen p-2 bg-bgSection border-r border-strokeSoft200 flex flex-col gap-4 w-[54px] transition-[width] duration-300;
  }

  .navWrapper .nav__item {
    @apply justify-center overflow-hidden;
  }

  .navWrapper.isExpanded {
    @apply w-[250px];
  }

  .navWrapper.isExpanded .nav__item {
    justify-content: flex-start;
  }

  .nav__item {
    @apply flex items-center grow-1 gap-2 p-2 text-sm transition-colors rounded cursor-pointer hover:bg-fadedLight text-textStrong950;
  }

  .nav__item.isSelected {
    @apply bg-primaryBase text-staticWhite;
  }
</style>

