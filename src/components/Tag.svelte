<script lang="ts">
  export let color = "#2D79FF";
  export let textColor = "white";
</script>

<div
  on:click|stopPropagation
  class="tag"
  style:color={textColor}
  style:background={color}
>
  <slot />
</div>

<style>
  .tag {
    padding: 2px 4px;
    border-radius: 2px;
    width: fit-content;
    font-size: 12px;
  }
</style>
