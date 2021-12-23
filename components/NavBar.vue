<template>
  <div>
    <!-- <div class="nav_line"></div> -->
    <div id="nav" class="nav">
      <div class="logo">
        <img src="~assets/img/logo3.png" alt="" />
      </div>
      <div class="nav__right">
        <ul class="nav__tab-list">
          <li class="nav__tab-list__item">
            <nuxt-link to="/">Trang Chủ</nuxt-link>
          </li>
          <li class="nav__tab-list__item">
            <nuxt-link to="/test">tất cả sản phẩm</nuxt-link>
          </li>
          <li class="nav__tab-list__item">
            <nuxt-link to="/">Ưu đãi</nuxt-link>
          </li>
          <li class="nav__tab-list__item">
            <nuxt-link to="/">Giới thiệu</nuxt-link>
          </li>
        </ul>
        <div class="icon">
          <div class="dropdown">
            <i class="fas fa-user">
              <ul class="dropdown_list">
                <li v-if="$auth.loggedIn" class="dropdown_item">
                  <nuxt-link to="/profile" class="dropdown_text"
                    >Trang cá nhân</nuxt-link
                  >
                </li>
                <li v-if="!$auth.loggedIn" class="dropdown_item">
                  <nuxt-link to="/login" class="dropdown_text"
                    >Đăng nhập</nuxt-link
                  >
                </li>
                <li v-else class="dropdown_item">
                  <span class="dropdown_text" @click="userLogOut()"
                    >Đăng xuất</span
                  >
                </li>
              </ul>
            </i>
          </div>
          <i class="fas fa-shopping-cart"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$auth.user
    },
  },
  methods: {
    async userLogOut() {
      try {
        const response = await this.$auth.logout({
          data: {
            refreshToken: this.$auth.strategies.google.refreshToken.get(),
          },
        })
        this.$router.go('/')
        console.log(response)
      } catch (err) {
        console.log(err)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';

* {
  font-size: 16px;
  font-weight: 300;
}
.nav_line {
  width: 100%;
  height: 20px;
  background: $black;
}
// .nav_slide {
//   width: 100%;
//   height: 50px;
//   background: $white2;
// }
.nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: $red;
  padding: 15px 0px;
  z-index: 99;
  height: 90px;
  font-family: 'Roboto Condensed', sans-serif;
  font-weight: 200;
  &__right {
    display: flex;
    align-items: center;
  }

  &__tab-list {
    &__item {
      position: relative;
    }
    &__item:hover a::before {
      visibility: visible;
      animation: show-underline 1s;
      animation-fill-mode: forwards;
    }
    a::before {
      content: '';
      position: absolute;
      bottom: 1px;
      height: 1px;
      // width: 100%;
      background-color: $white;
      visibility: hidden;
    }
  }
}
.logo {
  height: 100%;
  img {
    height: 100%;
    transform: scale(1.9);
    // width: 130px;
    // height: 100%;
    // object-fit: cover;
  }
}
.icon {
  position: relative;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  i {
    font-size: 1.3rem;
    margin-left: 10px;
    color: $white;
  }
}
ul {
  display: flex;
  list-style: none;
  font-size: 1.2rem;
  padding: 10px;
  margin: 10px;

  li {
    text-transform: uppercase;
    margin-left: 15px;
    letter-spacing: 0;
  }
}
a {
  font-weight: bold;
  color: $white;
  text-decoration: none;
  .router-link-exact-active {
    transition: 0.5s;
  }
}
.dropdown {
  transition: 0.3s ease-in-out;
}
.dropdown_list {
  text-align: center;
  width: 200px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  position: absolute;
  right: -20px;
  top: 10px;
  display: none;
  font-weight: bold;
  transition: 0.3s ease-in-out;
}
.dropdown:hover .dropdown_list {
  display: block;
}
.dropdown_item {
  padding: 10px;
  background: $white;
  color: $black;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  a {
    color: $black;
  }
}

@keyframes show-underline {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
</style>
