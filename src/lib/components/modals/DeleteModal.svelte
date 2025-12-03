<script lang="ts">
  import Modal from '$components/common/ui/Modal.svelte'
  import { Button } from '$components/common/ui'

  import deleteIconSrc from '$assets/images/infored.svg'

  interface Props {
    isOpen?: boolean
    isLoading?: boolean
    title?: string
    text?: string
    onClose: () => void
    onSubmit: () => void
  }

  let {
    isOpen = false,
    isLoading = false,
    title = 'Delete',
    text = '',
    onClose,
    onSubmit
  }: Props = $props()
</script>

<Modal
  isOpen={isOpen}
  onClose={onClose}
  className="w-[440px]"
>
  <div class="flex justify-center">
    <div class="mb-6 w-10 h-10 rounded-md bg-errorLight center">
      <img src={deleteIconSrc} alt="Delete icon" />
    </div>
  </div>

  <div class="text-center text-[18px]">{title}</div>
  <div class="mt-6 text-center text-textSub600 text-[13px]">{text}</div>

  {#snippet footer()}
    <Button type="secondary" className="mr-3" onClick={onClose}>Cancel</Button>
    <Button
      type="danger"
      onClick={onSubmit}
      isDisabled={isLoading}
      isLoading={isLoading}
    >Delete</Button>
  {/snippet}
</Modal>
