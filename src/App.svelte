<script>
  import Accelerator from "./components/Accelerator.svelte";

  let accelerator = "";

  // @ts-ignore
  window.electron?.getQuickOpenShortcut?.().then((shortcut) => {
    accelerator = shortcut;
  });
</script>

<div class="titlebar">Change Quick Open Shortcut</div>

<div class="container">
    <Accelerator
      {accelerator}
      on:change={({ detail: { value } }) => {
        if (!value) return;
        // @ts-ignore
        window.electron?.setQuickOpenShortcut?.(value);
      }}
    />
</div>

<style>
  :global(html) {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    margin: 0;
    height: 100%;
    width: 100%;
  }
  :global(body) {
    margin: 0;
  }

  .titlebar {
    height: 28px;
    -webkit-app-region: drag;
    color: #666;
    font-size:12px;
    font-weight: bold;
    text-align: center;
    line-height: 28px;
    margin-bottom: 20px;
    border-bottom: 1px #eee solid;
    cursor: default;
    user-select: none;
  }

  .container {
    padding: 20px;
  }
</style>
