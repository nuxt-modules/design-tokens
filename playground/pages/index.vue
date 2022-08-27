<template>
  <div
    class="app"
  >
    <header>
      <span>
        @nuxtjs/design-tokens
      </span>
    </header>

    <section>
      <Block primary />
      <Block lila />
      <Block lavender />
      <Block velvet />
      <Block grape />
    </section>

    <footer>
      <span>
        {{ 'Footer' }}
      </span>

      <span>Built with @nuxtjs/design-tokens</span>
    </footer>
  </div>
</template>

<style>
html {
  font-family: Inter, sans-serif;
}
</style>

<style scoped lang="postcss">
.app {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow-y: auto;
  background-color: $dt('colors.primary.100');
  color: white;

  @dark {
    background-color: $dt('colors.primary.200');
  }

  @screen lg {
    background-color: $dt('colors.primary.900');
  }

  header {
    display: flex;
    align-items: center;
    padding: 1rem 2rem;
    position: sticky;
    top: 0;
    width: 100%;
    background-color: $dt('colors.black');
    z-index: 50;

    span {
      font-weight: bold;
    }
  }

  section {
    flex: 1;
    width: 100%;
    overflow-y: auto;
    padding: 1rem 2rem;
    z-index: 50;

    & > * + * {
      margin-top: 1rem;
    }
  }

  footer {
    background-color: $dt('colors.black');
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    position: sticky;
    top: 0;
    width: 100%;
    background-color: $dt('colors.black');
    z-index: 50;

    span {
      font-weight: bold;
    }
  }
}
</style>
