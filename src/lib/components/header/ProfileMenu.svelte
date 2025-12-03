<script lang="ts">
  import { get } from 'svelte/store'

  import { authStore, userProfile } from '$lib/stores/authStore'
  import { Theme, theme } from '$lib/services/themeService'
  import { clickOutside } from '$lib/utils/dom'
  import { getProfileInitials } from '$lib/utils/profile'
  import { logout } from '$lib/services/authService'

  import AvatarIcon from '$components/common/AvatarIcon.svelte'

  import topmoon from '$assets/images/topmoon.svg'
  import tophelp from '$assets/images/tophelp.svg'
  import toplogout from '$assets/images/toplogout.svg'
  import topsettings from '$assets/images/topsettings.svg'

  interface Props {
    isExpanded: boolean
  }

  let { isExpanded }: Props = $props()

  let isDropdownVisible = $state(false)
  let isDarkTheme = $state(get(theme) === Theme.Dark)

  const openDropdown = () => {
    isDropdownVisible = true
  }

  const toggleTheme = () => {
    theme.update((t) => (t === Theme.Light ? Theme.Dark : Theme.Light))
  }

  const handleLogoutClick = (e: MouseEvent) => {
    isDropdownVisible = false
    e.preventDefault()
    logout()
  }
</script>

<div class="info header flex items-center">
  <div class="relative">
    <div
      class="flex items-center gap-2 cursor-pointer"
      onclick={openDropdown}
      role="presentation"
    >
      <AvatarIcon nameInitials={getProfileInitials($userProfile)} className="bg-primaryBase! ml-0.5 text-staticWhite" />

      {#if isExpanded}
        <span class="text-sm text-nowrap overflow-hidden">
          {$userProfile?.firstName || ''}
          {$userProfile?.lastName || ''}
        </span>
      {/if}
    </div>

    {#if isDropdownVisible}
      <div
        id="profile-menu"
        class="account-items absolute bottom-full left-8 mt-2 rounded-lg border border-strokeSoft200 bg-bgWhite0 p-4 shadow-lg flex flex-col z-10 w-64"
        use:clickOutside={(e) => {
          e.stopPropagation()
          isDropdownVisible = false
        }}
      >
        <div class="flex items-center text-sm leading-5 pb-2 mb-2">
          <div class="basic-info">
            <h3>{$authStore?.profile?.firstName} {$authStore?.profile?.lastName}</h3>
            <span class="text-gray-400">{$authStore?.profile?.email}</span>
          </div>
        </div>
        <div class="flex items-center justify-between text-sm leading-5 py-2 border-t border-strokeSoft200 cursor-pointer">
          <div class="sub-menu flex">
            <img src={topmoon} alt="topmoon " width="19" class="rounded-full mr-2"/>
            <span>Dark Mode</span>
          </div>
          <label class="switch ml-2">
            <input type="checkbox" bind:checked={isDarkTheme} onchange={toggleTheme}>
            <span class="slider round"></span>
          </label>
        </div>
        <a onclick={() => { isDropdownVisible = false }} href="/settings" class="flex items-center text-sm leading-5 py-2 cursor-pointer">
          <div class="sub-menu flex">
            <img src={topsettings} alt="topmoon " width="19" class="rounded-full mr-2"/>
            <span>Settings</span>
          </div>
        </a>
        <a href="/help" class="flex items-center text-sm leading-5 py-2 border-t border-strokeSoft200 cursor-pointer">
          <div class="sub-menu flex">
            <img src={tophelp} alt="topmoon " width="19" class="rounded-full mr-2"/>
            <span>Help</span>
          </div>
        </a>
        <button
          onclick={handleLogoutClick}
          class="flex items-center text-sm leading-5 py-2 border-t border-strokeSoft200 cursor-pointer"
        >
          <span class="sub-menu flex">
            <img src={toplogout} alt="topmoon" width="19" class="rounded-full mr-2"/>
            <span>Logout</span>
          </span>
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
    .switch {
        position: relative;
        display: inline-block;
        width: 34px;
        height: 20px;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 34px;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 12px;
        width: 12px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }

    input:checked + .slider {
        background-color: var(--primary-base);
    }

    input:checked + .slider:before {
        transform: translateX(14px);
    }

    .slider.round {
        border-radius: 34px;
    }

    .slider.round:before {
        border-radius: 50%;
    }

</style>
