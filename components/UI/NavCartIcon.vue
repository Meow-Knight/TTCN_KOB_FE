<template>
  <div class="container">
    <div class="wrapper" :class="{ transparent, bump }">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="cart-icon"
      >
        <path
          class="icon"
          d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
        />
      </svg>
      <div class="number-items">
        <div class="content">{{ numberItems }}</div>
      </div>
    </div>
    <!-- <div class="dropdown-cart"> -->
    <div v-if="showDropdown" class="dropdown-cart">
      <cart></cart>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
import Cart from '../Cart.vue'
export default {
  components: {
    Cart,
  },
  props: ['transparent'],
  // bump property will be use to decide whether we assign bump class for cart icon
  // only change to cart length, like add a new item or remove item, will trigger
  // the bump property
  data() {
    return {
      bump: false,
      showDropdown: false,
    }
  },
  computed: {
    numberItems() {
      return this.$store.state.cart.items
        ? this.$store.state.cart.items.length
        : 0
    },
  },
  watch: {
    numberItems() {
      this.bump = true
      setTimeout(() => {
        this.bump = false
      }, 300)
    },
  },
  mounted() {
    this.$el.addEventListener('mouseover', () => {
      this.showDropdown = true
    })
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';

.container {
  position: relative;
  height: fit-content;
  width: fit-content;
  padding: 0 0 20px 0;
  margin: 0;
}

.wrapper {
  position: relative;
  z-index: 100;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: 0.3s ease;
}

.container:hover {
  .wrapper {
    transform: scale(1.1);
    transition: 0.3s ease;
  }
  .dropdown-cart {
    will-change: transform;
    -webkit-animation: showDropdown 0.3s cubic-bezier(0.4, 0, 0.6, 1);
    animation: showDropdown 0.3s cubic-bezier(0.4, 0, 0.6, 1);
    transform: scale(1);
    opacity: 1;
  }
}

.wrapper.bump {
  animation: bump 0.3s ease-out;
}

.cart-icon {
  width: 60px;
  height: 60px;
  margin: auto;
  color: $red;
  stroke: $white;
  stroke-width: 0.7;
  transition: 0.5s ease;
}

.number-items {
  position: absolute;
  border-radius: 50%;
  color: $white;
  font-size: 13px;
  font-weight: bold;
  top: 10px;
  left: 7px;
  width: 30px;
  height: 30px;
  transition: 0.5s;
}

.content {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.dropdown-cart {
  padding: 20px 10px 0 0;
  position: absolute;
  top: 80%;
  right: -100px;
  transform: scale(0);
  opacity: 0;
  animation: hideDropdown 0.3s cubic-bezier(0.4, 0, 0.6, 1);
  -webkit-animation: hideDropdown 0.3s cubic-bezier(0.4, 0, 0.6, 1);
  will-change: transform;
  transform-origin: calc(100% - 120px) 0px;
}

.wrapper.transparent {
  .cart-icon {
    transition: 0.5s;
    color: transparent;
    stroke: $red;
  }
  .number-items {
    color: $red;
  }
}

@keyframes bump {
  0% {
    transform: scale(1);
  }
  10% {
    transform: scale(1.05);
  }
  30% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes showDropdown {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes hideDropdown {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0);
  }
}
</style>
