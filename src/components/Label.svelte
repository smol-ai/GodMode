<script lang="ts">
  export let label: string;
</script>

<div class="label">
  <slot name="label-prefix" />
  <label on:click for={label}>
    <div>
      {#if $$slots["label-text"]}
        <slot name="label-text" />
      {:else}
        {label}
      {/if}
    </div>
  </label>
  <slot name="label-suffix" />
</div>

<style>
  .label {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
  }
</style>
