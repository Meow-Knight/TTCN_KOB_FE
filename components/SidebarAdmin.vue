<template>
  <div class="sidebar">
    <div class="logo">
      <img src="~assets/img/logo3.png" alt="" />
    </div>
    <ul class="menu">
      <li class="menu__item">
        <nuxt-link to="/dashboard">
          <div class="icon"><i class="far fa-clipboard"></i></div>
          Doanh số
        </nuxt-link>
      </li>
      <li class="menu__item">
        <nuxt-link to="/dashboard/orders">
          <div class="icon"><i class="far fa-clipboard"></i></div>
          Đơn hàng
        </nuxt-link>
      </li>
      <li class="menu__item">
        <nuxt-link to="/dashboard/producers">
          <div class="icon"><i class="far fa-building"></i></div>
          Nhà sản xuất
        </nuxt-link>
      </li>
      <li v-if="isAdmin" class="menu__item">
        <nuxt-link to="/dashboard/customers">
          <div class="icon"><i class="fas fa-users"></i></div>
          Khách hàng
        </nuxt-link>
      </li>
      <li v-if="isAdmin" class="menu__item">
        <nuxt-link to="/dashboard/staffs">
          <div class="icon"><i class="fas fa-user-cog"></i></div>
          Nhân viên
        </nuxt-link>
      </li>
      <li class="menu__item">
        <nuxt-link to="/dashboard/beers">
          <div class="icon"><i class="fas fa-beer"></i></div>
          Sản phẩm
        </nuxt-link>
      </li>
      <li class="menu__item">
        <nuxt-link to="/dashboard/shipment">
          <div class="icon"><i class="fas fa-cubes"></i></div>
          Lô hàng
        </nuxt-link>
      </li>
      <li v-if="isAdmin" class="menu__item">
        <nuxt-link to="/dashboard/vouchers">
          <div class="icon"><i class="fas fa-gift"></i></div>
          Khuyến mãi
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    isAdmin() {
      return this.$auth.user.is_superuser
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';
.sidebar {
  height: 100%;
  min-height: 100vh;
  background-color: $breadcrumbBgrColor;
  margin-right: 20px;
  .logo {
    height: 100px;
    img {
      height: 100%;
    }
  }
  .menu {
    display: flex;
    flex-direction: column;
    list-style-type: none;
    padding: 0;
    * {
      color: $black;
      text-decoration: none;
    }
    &__item {
      padding-left: 20px;
      padding-top: 10px;
      padding-bottom: 10px;
    }
    &__item:hover {
      background-color: $hoverSidebar;
    }
  }
}
.icon {
  width: 20px;
  display: inline-block;
  text-align: center;
}
</style>
