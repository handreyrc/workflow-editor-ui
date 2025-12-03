<script lang="ts">
  import { writable } from 'svelte/store'

  import { useForm } from '$lib/utils/hooks'
  import type { DropDownOption } from '$lib/types/ui'
  import type { Column } from '$lib/types/table'

  import FormField from '$components/common/FormField.svelte'
  import { Button, Dropdown } from '$components/common/ui'
  import Table from '$components/common/table/Table.svelte'
  import SearchBar from '$components/common/SearchBar.svelte'
  import Tabs from '$components/common/Tabs.svelte'

  import EmptyMembersImg from '$assets/images/emptymembers.svg'

  const ROLE_OPTIONS: DropDownOption[] = [
    { id: 'admin', label: 'Admin', value: 'admin' },
    { id: 'editor', label: 'Editor', value: 'editor' },
    { id: 'viewer', label: 'Viewer', value: 'viewer' }
  ]

  const columns: Column<any>[] = [
    { key: 'user', label: 'User', isSorting: true },
    { key: 'email', label: 'Email', isSorting: true },
    { key: 'role', label: 'Role', isSorting: true },
    { key: 'status', label: 'Status', isSorting: true },
    { key: 'actions', label: '', isSorting: false }
  ]

  let search = writable('')

  let form = useForm({
    initialValues: {
      email: '',
      role: 'viewer',
    },
    validateOnInit: true,
    validate: (values) => {
      const errors: Record<string, string> = {}
      if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = 'Invalid email format'
      }

      return errors
    }
  })
</script>

<div class="p-6 border border-strokeSoft200 rounded-lg">
  <h4 class="font-medium mb-1">Invite Member</h4>
  <p class="text-textSub600 text-sm">Invite new members by email address. Invitations expire after 1 week.</p>

  <div class="form" role="form">
    <div class="mt-4"></div>
    <div class="flex items-center gap-4">
      <div class="flex grow-1 items-center gap-2 max-w-[960px]">
        <div class="basis-1/2">
          <FormField
            required
            name="email"
            label="Email"
            bind:value={$form.values.email}
            onChange={({ name, value }) => $form.change(name, value)}
            onBlur={(name) => $form.blur(name)}
            placeholder="Enter Email"
            className="min-w-40"
            errorMessage={$form.touched.email ? $form.errors.email : ''}
            errorClass="absolute mt-0.5!"
          />
        </div>

        <div class="basis-1/2">
          <Dropdown
            required
            label="Role"
            selected={ROLE_OPTIONS.find((option) => option.value === $form.values.role)}
            options={ROLE_OPTIONS}
            className="h-13.5 min-w-40"
            onChange={(option) => {
              $form.change('role', option.value)
              $form.validate()
            }}
          />
        </div>
      </div>

      <Button
        onClick={() => {}}
        isDisabled={$form.status.isError || !$form.values.email}
      >
        Invite
      </Button>
    </div>
  </div>
</div>


<div class="mt-8"></div>

<div class="flex justify-between items-center gap-2">
  <Tabs
    selected="members"
    tabs={[
      { label: 'Members', value: 'members' },
      { label: 'Invitations', value: 'invitations' },
    ]}
    onSelect={() => {}}
  />
  <SearchBar
    isFilter={false}
    onSearch={(value) => $search = value}
  />
</div>


<div class="mt-4"></div>
<Table
  {columns}
  data={[]}
  initialSortKey=""
  initialSortAsc={true}
  isFiltering={!!$search}
  pageSize={10}
  onRowClick={() => {}}
>
  {#snippet noResults()}
    <div class="center flex-col my-12">
      <img src={EmptyMembersImg} alt="" />
      <div class="text-lg font-medium mt-4 mb-4">No team members yet</div>
      <p class="text-center text-textSub600 text-sm">Invite collaborators to help build and manage workflows together.</p>
    </div>
  {/snippet}
</Table>
