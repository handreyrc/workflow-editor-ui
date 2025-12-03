<script lang="ts">
  import { Theme, theme } from '$lib/services/themeService.js'

  import { PlusIcon } from '$components/icons'
  import { Button } from '$components/common/ui'

  import EmptyProjectsIcon from '$assets/images/emptyprojects.svg'
  import EmptyProjectsLightIcon from '$assets/images/emptyprojects_light.svg'

  interface Props {
    onAdd: () => void
  }

  const { onAdd }: Props = $props()
</script>

<div class="center w-full h-full">
  <div class="center flex-col text-center">
    <div class="center">
      <img src={$theme === Theme.Dark ? EmptyProjectsIcon : EmptyProjectsLightIcon} alt="" />
    </div>
    <h1 class="text-[18px] font-bold mb-2 mt-3">Start adding Tasks</h1>
    <p class="text-[13px] mb-2">No tasks available. Let's get something started!</p>
    <Button
      className="mt-2"
      onClick={onAdd}
      icon={PlusIcon}
      iconSize={12}
    >
      Add Task
    </Button>
  </div>
</div>
