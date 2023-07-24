<script lang="ts">
  export let color = "#2D79FF";
  export let textColor = "white";

  /**
   * Allows specification of an existing preset, instead of manually specifying
   * color and textColor. Todo: move all current Tag usage to follow preset
   * pattern, creating new presets if needed
   */
  export let preset: "blue" | "purple" | undefined = undefined;
</script>

<div
  on:click|stopPropagation
  class="tag"
  class:blue-preset={preset === "blue"}
  class:purple-preset={preset === "purple"}
  style={preset === undefined ? "background: {color}; color: {textColor};" : ""}
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

  .blue-preset {
    background: #f0f8ff;
    border: 1px solid #0958d9;
    color: #0958d9;
    border-radius: 12px;
  }

  .purple-preset {
    background: #f9f0ff;
    border: 1px solid #531dab;
    color: #531dab;
    border-radius: 12px;
  }
</style>
