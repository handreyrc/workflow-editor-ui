<script lang="ts">
  import { theme, Theme } from '$lib/services/themeService'

  import EmptyImage from '$assets/images/emptyintegration.svg'
  import EmptyImageLight from '$assets/images/emptyintegration_light.svg'
</script>

<div class="center grow">
  <div class="center flex-col text-center">
    <div class="center">
      <img src={$theme === Theme.Dark ? EmptyImage : EmptyImageLight} alt="empty Workflow" />
    </div>
    <h1 class="text-[18px] font-bold mb-2 mt-3">Coming Soon</h1>
  </div>
</div>
