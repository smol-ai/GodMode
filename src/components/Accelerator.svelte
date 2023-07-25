<script lang="ts">
  import { createEventDispatcher, setContext } from "svelte";
  import Tag from "./Tag.svelte";

  export let label = "";
  export let disabled = false;
  export let accelerator: string | undefined = "";

  type AcceleratorContext = {
    onChange: (oldKey: string, newKey: string) => void;
  };

  // TODO: Get process using IPC
  let currentPlatform: NodeJS.Platform = "darwin";

  const MetaKey = currentPlatform === "darwin" ? "Command" : "Super";

  setContext<AcceleratorContext>("accelerator", {
    onChange: (oldKey: string, newKey: string) => {
      const keyIndex = shortcut.indexOf(oldKey);
      if (keyIndex !== -1) {
        shortcut[keyIndex] = newKey;
      }
    },
  });

  let shortcut: string[] = [];
  let modifierKeySet = new Set<string>();
  let interimShift = false;
  let isRecording = false;

  const dispatch = createEventDispatcher<{ change: { value: string } }>();
  const modifierKeys = new Set(["Control", "Shift", "Alt", "Meta"]);

  $: shortcut = accelerator ? accelerator.split("+").filter(Boolean) : [];

  $: if (shortcut) {
    dispatch("change", {
      value: shortcut.length > 0 ? shortcut.filter(Boolean).join("+") : "",
    });
  }

  function mapWebKeyCodeToElectronKeyCode(code: KeyboardEvent["code"]): string {
    return code
      .toUpperCase()
      .replace("KEY", "")
      .replace("DIGIT", "")
      .replace("NUMPAD", "NUM")
      .replace("COMMA", ",");
  }

  function onlyPressedModifierKeyIsShift(): boolean {
    return (
      modifierKeySet.size === 1 && modifierKeySet.has("Shift") && interimShift
    );
  }

  function recordShortcut(event: KeyboardEvent): void {
    event?.preventDefault();
    if (!isRecording) {
      return;
    }
    const { key } = event;
    if (key === "Shift") {
      interimShift = true;
    }
    if (interimShift && modifierKeys.has(key)) {
      modifierKeySet.add("Shift");
      if (key === "Meta") {
        modifierKeySet.add(MetaKey);
      } else {
        modifierKeySet.add(key);
      }
    } else if (modifierKeys.has(key)) {
      if (key === "Meta") {
        modifierKeySet.add(MetaKey);
      } else {
        modifierKeySet.add(key);
      }
    } else if (
      key.length === 1 &&
      modifierKeySet.size > 0 &&
      !onlyPressedModifierKeyIsShift()
    ) {
      // Construct the final shortcut array from the set of modifier keys and the non-modified key
      const nonModifiedKey = mapWebKeyCodeToElectronKeyCode(event.code);

      if (interimShift === false) {
        modifierKeySet.delete("Shift");
      }

      const finalShortcut = Array.from(modifierKeySet).concat(nonModifiedKey);

      shortcut = finalShortcut;
      modifierKeySet = new Set<string>();
      interimShift = false;
      isRecording = false;
    }
  }

  function keyUp(event: KeyboardEvent): void {
    if (!isRecording) return;
    if (event.key === "Escape") {
      isRecording = false;
    }
    const { key } = event;
    if (event.key === "Shift") {
      interimShift = false;
    } else if (modifierKeys.has(key)) {
      modifierKeySet.delete(key);
    }
  }

  function toggleRecording(): void {
    isRecording = !isRecording;
  }

  function turnRecordingOff(): void {
    isRecording = false;
  }
</script>

<div>
  {#if !shortcut || shortcut.length == 0}
    <button
      class="accelerator"
      on:click={toggleRecording}
      on:keydown={recordShortcut}
      on:keyup={keyUp}
      >{isRecording
        ? "Recording shortcut..."
        : "Click to record shortcut"}</button
    >
  {:else}
    <div class="accelerator-wrapper">
      <div class="accelerator">
        {#if !isRecording}
          {#each shortcut as token}
            <div class="tag" style:background="#f5f5f5" style:color="black">
              <div class="accelerator-token">
                {token}
              </div>
            </div>
          {/each}
        {:else}
          <div class="tag" style:background="#e0e7ff" style:color="3730a3">
            Recording shortcut...
          </div>
        {/if}
      </div>
      <button
        on:click={toggleRecording}
        on:keydown={recordShortcut}
        on:keyup={keyUp}
        on:blur={turnRecordingOff}
      >
        {isRecording ? "Cancel recording" : "Click to record new shortcut"}
      </button>
    </div>
  {/if}
</div>

<style>
  .accelerator-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .accelerator {
    color: rgba(0, 0, 0, 0.8) !important;
    background: transparent;
    border-radius: 4px;
    padding: 0px 8px;
    transition: var(--theme-transitions-primary);
    border: 1px solid;
    border-color: rgba(0, 0, 0, 0.1);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 8px;
    gap: 4px;
    font-size: 12px;
  }

  .accelerator:hover {
    border-color: rgba(0, 0, 0, 0.5);
  }

  .accelerator :global(.tag),
  .accelerator :global(select) {
    background: rgba(0, 0, 0, 0.1);
    color: rgba(0, 0, 0, 0.8);
  }

  .accelerator :global(select) {
    border: none;
    padding: 1px 4px;
    border-radius: 2px;
  }

  .accelerator :global(select:focus) {
    outline: none;
  }

  .accelerator-token {
    display: flex;
    align-items: center;
  }

  .tag {
    padding: 2px 4px;
    border-radius: 2px;
    width: fit-content;
    font-size: 12px;
  }

  button {
    padding: 8px;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
</style>
