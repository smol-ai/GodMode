<script>
  import Accelerator from "./components/accelerator/Accelerator.svelte";

  let accelerator = "";

  // @ts-ignore
  window.electron?.getQuickOpenShortcut?.().then((shortcut) => {
    accelerator = shortcut;
  });
</script>

<Accelerator
  label="Quick Open Keyboards Shortcut"
  {accelerator}
  on:change={({ detail: { value } }) => {
    if (!value) return;
    // @ts-ignore
    window.electron?.setQuickOpenShortcut?.(value);
  }}
/>

<style>
  :global(html) {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
</style>
