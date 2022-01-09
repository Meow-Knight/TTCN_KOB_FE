<template>
  <div class="dropdown" @click="changeDropdownStatus">
    <div class="dropdown-placeholder">{{ selectedOption }}</div>
    <svg
      v-if="!showDropdown"
      enable-background="new 0 0 11 11"
      viewBox="0 0 11 11"
      height="11px"
      width="11px"
      x="0"
      y="0"
      class="icon-arrow-down"
    >
      <g>
        <path
          d="m11 2.5c0 .1 0 .2-.1.3l-5 6c-.1.1-.3.2-.4.2s-.3-.1-.4-.2l-5-6c-.2-.2-.1-.5.1-.7s.5-.1.7.1l4.6 5.5 4.6-5.5c.2-.2.5-.2.7-.1.1.1.2.3.2.4z"
        ></path>
      </g>
    </svg>
    <svg
      v-else
      enable-background="new 0 0 11 11"
      viewBox="0 0 11 11"
      height="11px"
      width="11px"
      x="0"
      y="0"
      class="shopee-svg-icon icon-arrow-up"
    >
      <g>
        <path
          d="m11 8.5c0-.1 0-.2-.1-.3l-5-6c-.1-.1-.3-.2-.4-.2s-.3.1-.4.2l-5 6c-.2.2-.1.5.1.7s.5.1.7-.1l4.6-5.5 4.6 5.5c.2.2.5.2.7.1.1-.1.2-.3.2-.4z"
        ></path>
      </g>
    </svg>
    <div class="dropdown-content" :class="{ show: showDropdown }">
      <div
        v-for="(option, index) in options"
        :key="index"
        class="dropdown-content-item"
        @click="setSelectedOption(option)"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['name', 'options', 'setSelectedOption', 'selectedOption'],
  data() {
    return {
      showDropdown: false,
    }
  },
  mounted() {
    window.addEventListener('click', (event) => {
      if (!event.path.includes(this.$el)) this.showDropdown = false
    })
  },
  methods: {
    changeDropdownStatus() {
      this.showDropdown = !this.showDropdown
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~assets/scss/variables';

.dropdown {
  display: flex;
  width: 220px;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  border: 1px solid rgba(0, 0, 0, 0.14);
  border-radius: 3px;
  height: 35px;
  position: relative;
  cursor: pointer;
}

.dropdown-content {
  max-height: 0;
  width: 100%;
  transition: max-height 0.3s ease;
  overflow: auto;
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  border-radius: 3px;
  border-top: none;
  z-index: 20;
}

.dropdown-content.show {
  max-height: 500%;
  overflow: auto;
  transition: max-height 0.3s ease;
}

.dropdown-content-item {
  padding: 5px 6px;
  text-align: left;
  background: $white;
}

.dropdown-content-item:hover {
  color: $red;
  background: $white2;
}
</style>
