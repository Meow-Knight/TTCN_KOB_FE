/* eslint-disable vue/no-multiple-template-root */
<template>
  <teleport to="body">
    <div @click="$emit('close')"></div>
    <dialog open>
      <header>
        <slot name="header">
          <h2>{{ title }}</h2>
        </slot>
      </header>
      <section>
        <slot></slot>
      </section>
      <menu>
        <slot v-if="needConfirm" name="actions">
          <button @click="$emit('close')">Đóng</button>
        </slot>
      </menu>
    </dialog>
  </teleport>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
      default: 'Error',
    },
    needConfirm: {
      type: Boolean,
      required: false,
      default: true,
    },
    timeToDisappear: {
      type: Number,
      required: false,
      default: null,
    },
  },
  emits: ['close'],
  mounted() {
    if (!this.needConfirm && this.timeToDisappear) {
      setTimeout(() => {
        this.$emit('close')
      }, this.timeToDisappear)
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';
div {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(153, 148, 148, 0.75);
  z-index: 10;
}

dialog {
  position: fixed;
  top: 30vh;
  left: 10%;
  width: 80%;
  z-index: 100;
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(170, 160, 160, 0.26);
  padding: 0;
  margin: 0;
  overflow: hidden;
}

header {
  background-color: $red;
  color: white;
  width: 100%;
  padding: 1rem;
}

header h2 {
  margin: 0;
}

section {
  padding: 1rem;
}

menu {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  margin: 0;
}

button {
  cursor: pointer;
  background: $white;
  color: $red;
  border: 1px solid $red;
  border-radius: 8px;
  transition: 0.3s ease;
}

button:hover {
  background: $red;
  color: $white;
  transition: 0.3s ease;
}

@media (min-width: 768px) {
  dialog {
    left: calc(50% - 20rem);
    width: 40rem;
  }
}
</style>
