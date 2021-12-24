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
            <nuxt-link to="/dashboard/beers">Tất cả sản phẩm</nuxt-link>
          </li>
          <li class="nav__tab-list__item">
            <nuxt-link to="/dashboard">Ưu đãi</nuxt-link>
          </li>
          <li class="nav__tab-list__item">
            <nuxt-link to="/about">Giới thiệu</nuxt-link>
          </li>
        </ul>
        <div class="icon">
          <div class="dropdown">
            <i class="fas fa-user">
              <div v-if="$auth.loggedIn" class="username">
                {{ user.username }}
              </div>
              <ul class="dropdown_list">
                <li v-if="$auth.loggedIn" class="dropdown_item first">
                  <nuxt-link to="/profile" class="dropdown_text"
                    >Trang cá nhân</nuxt-link
                  >
                </li>
                <li v-if="!$auth.loggedIn" class="dropdown_item first">
                  <nuxt-link to="/login" class="dropdown_text"
                    >Đăng nhập</nuxt-link
                  >
                </li>
                <li v-else class="dropdown_item" @click="userLogOut()">
                  <span class="dropdown_text">Đăng xuất</span>
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
  justify-content: space-between;
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
      display: inline-block;
    }
    &__item:hover a::after {
      width: 100%;
    }
    a::after {
      content: '';
      display: block;
      background: $white;
      width: 0;
      height: 1px;
      position: absolute;
      left: 0;
      transition: 0.75s;
    }
  }
}
.nav__right {
  margin-right: 100px;
}
.logo {
  height: 100%;
  margin-left: 130px;
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
  width: 175px;
  i {
    font-size: 1.3rem;
    margin-left: 10px;
    color: $white;
    display: flex;
    align-items: center;
  }
}
.username {
  margin-left: 10px;
  margin-bottom: 5px;
  cursor: pointer;
  font-size: 20px;
}
ul {
  display: flex;
  list-style: none;
  font-size: 1.2rem;
  padding: 5px 10px;
  margin: 10px;

  li {
    text-transform: uppercase;
    margin-left: 30px;
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
  width: fit-content;
  padding: 13px 10px;
  margin: 0;
  display: flex;
  flex-direction: column;
  position: absolute;
  left: -25px;
  top: 20px;
  display: none;
}

.dropdown:hover .dropdown_list {
  display: block;
}

.dropdown_item {
  padding: 8px;
  margin: 0;
  background: $white2;
  color: $black;
  font-size: 1.1rem;
  width: 200px;
  cursor: pointer;
  a {
    color: $black;
    font-weight: normal;
  }
  transition: 0.5s ease-in-out;
}

.dropdown_item:hover {
  background: rgb(199, 178, 178);
  color: $red;
  a {
    color: $red;
  }
}

.dropdown_item.first::after {
  position: absolute;
  content: '';
  box-sizing: border-box;
  width: 12px;
  height: 12px;
  transform: rotate(45deg) translateX(-50%);
  background: $white2;
  top: 12px;
  left: 19.5%;
  transition: 0.5s ease-in-out;
}

.dropdown_item.first:hover::after {
  background: rgb(199, 178, 178);
}

.dropdown_text {
  font-size: 1rem;
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
