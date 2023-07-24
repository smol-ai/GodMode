<script lang="ts">
  export let id: string | null = null;
  export let testId: string | null = null;
  export let variant: 'primary' | 'secondary' | 'text' | 'danger' | 'link' =
    'primary';
  export let size: 'small' | 'medium' | 'large' = 'medium';
  export let block = false;
  export let style = ``;
  export let loading = false;
  export let disabled = false;
</script>

<button
  disabled={disabled || loading}
  data-test-id={testId}
  {id}
  {style}
  class:block={!!block}
  class:large={size === 'large'}
  class:small={size === 'small'}
  class:primary={variant === 'primary'}
  class:secondary={variant === 'secondary'}
  class:danger={variant === 'danger'}
  class:text={variant === 'text'}
  class:link={variant === 'link'}
  on:click
  on:keydown
  on:keyup
  on:blur
>
  {#if loading}
    <div class="loader" />
  {/if}
  <slot />
</button>

<style>
  button {
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
    border: 0;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    padding: var(--theme-spaces-4) var(--theme-spaces-5);
    font-size: var(--theme-fontSizes-3);
    border-radius: 4px;
    outline: none;
    border: 1px solid transparent;
  }

  .primary {
    background-color: var(--theme-colors-greys1);
    color: var(--theme-colors-greys9);
  }

  .primary:hover {
    background-image: linear-gradient(
      to bottom,
      hsla(0, 0%, 100%, 0.12),
      hsla(0, 0%, 100%, 0)
    );
  }

  .secondary {
    background: var(--theme-colors-white);
    color: var(--theme-colors-text);
    border: 1px solid;
    border-color: var(--theme-colors-greys7);
  }

  .secondary:hover {
    background-image: linear-gradient(
      to bottom,
      hsla(0, 0%, 0%, 0),
      hsla(0, 0%, 0%, 0.03)
    );
  }

  .danger {
    background: var(--theme-colors-danger);
    color: var(--theme-colors-white);
  }

  .text {
    background: none;
    color: var(--theme-colors-greys1);
    opacity: 0.5;
    transition: var(--theme-transitions-primary);
    border: 0;
    box-shadow: none;
  }

  .text:hover {
    opacity: 1;
    color: var(--theme-colors-primary);
  }

  .link {
    color: var(--theme-colors-primary);
    background: none;
    border: 0;
    box-shadow: none;
  }

  .large {
    height: 50px;
  }

  .small {
    font-size: var(--theme-fontSizes-2);
    padding: var(--theme-spaces-4) var(--theme-spaces-5);
  }

  .block {
    display: block;
    width: 100%;
  }

  .loader {
    align-self: center;
    display: inline-block;
    margin-right: var(--theme-spaces-4);
    border: 2px solid transparent;
    border-top: 2px solid #fff;
    border-radius: 50%;
    width: var(--theme-spaces-6);
    height: var(--theme-spaces-6);
    animation: spin 0.8s linear infinite;
  }

  button[disabled] {
    cursor: not-allowed;
    background: var(--theme-colors-greys7);
    border: 1px solid var(--theme-colors-divider);
    color: var(--theme-colors-greys5);
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @media (prefers-color-scheme: dark) {
    .text {
      color: var(--theme-colors-white);
    }

    .secondary {
      background: rgba(0, 0, 0, 0.1);
      color: var(--theme-colors-greys10);
      border-color: rgba(255, 255, 255, 0.4);
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.3);
    }

    .secondary:hover {
      background-image: linear-gradient(
        to bottom,
        hsla(0, 0%, 0%, 0.12),
        hsla(0, 0%, 0%, 0)
      );
    }

    .primary {
      background-color: var(--theme-colors-greys9);
      color: var(--theme-colors-text);
    }

    .primary:hover {
      background-image: linear-gradient(
        to bottom,
        hsla(0, 0%, 0%, 0.12),
        hsla(0, 0%, 0%, 0)
      );
    }
  }
</style>
