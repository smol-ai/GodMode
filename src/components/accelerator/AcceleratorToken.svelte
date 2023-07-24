<script lang="ts">
  import Tag from "./Tag.svelte";
</script>

<Tag color="#f5f5f5" textColor="black">
  <div class="accelerator-token">
    <slot />
  </div>
</Tag>

<style>
  .accelerator-token {
    display: flex;
    align-items: center;
  }
</style>
