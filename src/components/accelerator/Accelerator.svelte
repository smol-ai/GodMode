<script lang="ts">
  import CrossIcon from "../CrossIcon.svelte";
  import Label from "../Label.svelte";
  import AcceleratorToken from "./AcceleratorToken.svelte";
  import { createEventDispatcher, setContext } from "svelte";

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
      modifierKeySet.add(key);
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

  function resetShortcut(): void {
    shortcut = [];
    interimShift = false;
    isRecording = false;
    modifierKeySet = new Set<string>();
  }

  function toggleRecording(): void {
    isRecording = !isRecording;
  }

  function turnRecordingOff(): void {
    isRecording = false;
  }
</script>

<div>
  {#if label}
    <Label {label}>
      <slot name="label-prefix" slot="label-prefix" />
      <slot name="label-suffix" slot="label-suffix" />
    </Label>
  {/if}
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
      <div class="accelerator" class:accelerator-disabled={disabled}>
        {#if !isRecording}
          {#each shortcut as token}
            <AcceleratorToken>
              {token}
            </AcceleratorToken>
          {/each}
          {#if !disabled}
            <button
              on:click|preventDefault={resetShortcut}
              class="accelerator-reset-button"
            >
              <CrossIcon />
            </button>
          {/if}
        {:else}
          Recording shortcut...
        {/if}
      </div>
      {#if !disabled}
        <button
          on:click={toggleRecording}
          on:keydown={recordShortcut}
          on:keyup={keyUp}
          on:blur={turnRecordingOff}
        >
          {isRecording ? "Cancel recording" : "Click to record new shortcut"}
        </button>
      {/if}
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
  }

  .accelerator-reset-button {
    margin-left: auto;
    padding: 0;
    border: none;
    background: transparent;
    opacity: 0.5;
    transition: var(--theme-transitions-primary);
    color: var(--theme-colors-greys1);
  }

  .accelerator-reset-button:hover {
    opacity: 1;
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

  .accelerator-disabled {
    background: rgba(0, 0, 0, 0.1) !important;
    cursor: not-allowed;
  }
  .accelerator-disabled :global(.tag) {
    color: rgba(0, 0, 0, 1) !important;
    background: rgba(0, 0, 0, 0.125) !important;
  }
  .accelerator-wrapper:hover .accelerator-disabled {
    border-color: rgba(0, 0, 0, 0.1);
  }

  @media (prefers-color-scheme: dark) {
    .accelerator {
      border-color: rgba(225, 225, 225, 0.1);
      color: rgba(225, 225, 225, 0.8) !important;
    }
    .accelerator:hover {
      border-color: rgba(225, 225, 225, 0.5);
    }
    .accelerator-reset-button {
      color: var(--theme-colors-white);
    }
    .accelerator :global(.tag),
    .accelerator :global(select) {
      color: rgba(225, 225, 225, 0.8) !important;
      background: rgba(225, 225, 225, 0.1) !important;
    }
    .accelerator-disabled :global(.tag) {
      color: rgba(225, 225, 225, 1) !important;
      background: rgba(225, 225, 225, 0.25) !important;
    }
    .accelerator-wrapper:hover .accelerator-disabled {
      border-color: rgba(225, 225, 225, 0.1);
    }
  }
</style>
