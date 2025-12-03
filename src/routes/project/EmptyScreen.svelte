<script lang="ts">
  import { theme, Theme } from '$lib/services/themeService.js'

  import { PlusIcon } from '$components/icons'
  import { Button } from '$components/common/ui'

  import EmptyProjectsIcon from '$assets/images/emptyprojects.svg'
  import EmptyProjectsLightIcon from '$assets/images/emptyprojects_light.svg'

  interface Props {
    onAdd: () => void
  }

  const {
    onAdd
  }: Props = $props()
</script>

<div class="center w-full h-full">
  <div class="center flex-col text-center">
    <div class="center">
      <img src={$theme === Theme.Dark ? EmptyProjectsIcon : EmptyProjectsLightIcon} alt="empty project" />
    </div>
    <h1 class="text-[18px] font-bold mb-2 mt-3">Start adding Projects</h1>
    <p class="text-[13px] mb-2">No projects available. Let's get something started!</p>
    <Button
      className="mt-2"
      onClick={onAdd}
      icon={PlusIcon}
      iconSize={12}
    >
      Add Project
    </Button>
  </div>
</div>
