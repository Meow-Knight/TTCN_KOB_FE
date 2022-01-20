<template>
  <div class="sidebar">
    <div class="header">
      <nuxt-link to="/user/account/info" class="avatar-wrapper">
        <img
          class="avatar"
          :src="user.avatar || require('~/assets/img/logo3.png')"
        />
      </nuxt-link>
      <div class="username">{{ user.username }}</div>
    </div>
    <div class="menu-container">
      <div
        v-for="item in menuItems"
        :key="item.category"
        class="menu-item"
        :class="{
          open: isMenuItemSelected(item.category),
          'no-sub-items': !item.subItems,
        }"
      >
        <div class="menu-item__header">
          <div class="menu-icon-wrapper">
            <img class="menu-icon" :src="item.icon" />
          </div>
          <nuxt-link class="menu-item__display" :to="item.path">{{
            item.name
          }}</nuxt-link>
        </div>
        <div v-if="item.subItems" class="menu-item__body">
          <nuxt-link
            v-for="subItem in item.subItems"
            :key="subItem.name"
            class="sub-item"
            :to="subItem.path"
            :class="{ selected: isSubItemSelected(subItem.path) }"
          >
            {{ subItem.name }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      test: false,
    }
  },
  computed: {
    user() {
      return this.$auth.user
    },
    menuItems() {
      return [
        {
          name: 'Tài khoản',
          category: 'account',
          icon: require('~/assets/img/user.png'),
          basePath: '/user/account',
          path: '/user/account/info',
          subItems: [
            {
              path: '/user/account/info',
              name: 'Hồ sơ',
            },
            // {
            //   path: '/user/account/info',
            //   name: 'Hồ sơ',
            // },
            {
              path: '/user/account/address',
              name: 'Địa chỉ',
            },
            // {
            //   path: '/user/account/info',
            //   name: 'Hồ sơ',
            // },
          ],
        },
        {
          name: 'Giỏ hàng',
          category: 'cart',
          basePath: '/user/cart',
          path: '/user/cart',
          icon: require('~/assets/img/cart.jpg'),
        },
        {
          name: 'Đơn hàng',
          category: 'purchase',
          basePath: '/user/purchase',
          path: '/user/purchase',
          icon: require('~/assets/img/purchase-icon.jpg'),
        },
      ]
    },
    pagePath() {
      return this.$route.path
    },
  },
  methods: {
    isMenuItemSelected(basePath) {
      return this.pagePath.includes(basePath)
    },
    isSubItemSelected(subPath) {
      return this.pagePath.includes(subPath)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';
.sidebar {
  height: fit-content;
  min-height: 60%;
  width: 300px;
  padding: 0;
}

.header {
  display: flex;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #dbdada;
  margin-bottom: 20px;
  height: 80px;
}

.avatar-wrapper {
  width: 25%;
  padding-bottom: 25%;
  position: relative;
}

.avatar {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  perspective: 1px;
}

.username {
  text-align: flex-start;
  width: 75%;
  padding-left: 10%;
  height: fit-content;
  font-weight: 600;
  font-size: 16px;
}

.menu-item {
  height: fit-content;
  width: 100%;
  padding: 10px 0;
  position: relative;
}

.menu-item.open {
  .menu-item__body {
    max-height: 120px;
    transition: max-height 0.3s ease-in;
  }
}

.menu-item.open.no-sub-items {
  color: $red;
}

.menu-item__header {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
}

.menu-icon-wrapper {
  width: 15%;
  padding-bottom: 15%;
  position: relative;
}

.menu-icon {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.menu-item__display {
  width: 85%;
  padding-left: 10%;
  text-align: flex-start;
}

.menu-item__body {
  width: 100%;
  display: flex;
  flex-direction: column;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-in;
}

.sub-item {
  padding: 10px 25% 0 25%;
  font-weight: 400;
}

.sub-item.selected {
  color: $red;
  font-weight: 600;
}

a {
  text-decoration: none;
  color: inherit;
}
</style>
