<template>
  <div class="container">
    <div class="container-left">
      <div class="container-left__top">
        <div class="logo">
          <img
            width="150"
            height="150"
            alt="Logo"
            src="~assets/img/logo3.png"
            style="color: white"
          />
        </div>
        <div class="slogan">Drink to death</div>
      </div>
      <form class="login-section" @submit.prevent="adminLogin">
        <div class="form-title">Đăng nhập</div>
        <div class="option-choose">
          <div
            role="button"
            class="login-option"
            :class="{ selected: isAdminSelected }"
            @click="changeLoginStrategy('admin')"
          >
            <img
              width="50px"
              height="50px"
              alt="Admin login"
              src="~assets/img/admin.png"
            />
            <div class="option-description">Admin/Nhân viên</div>
          </div>
          <div
            role="button"
            class="login-option"
            :class="{ selected: !isAdminSelected }"
            @click="changeLoginStrategy('user')"
          >
            <img
              width="50px"
              height="50px"
              alt="User login"
              src="~assets/img/user1.png"
            />
            <div class="option-description">Khách hàng</div>
          </div>
        </div>
        <!-- <div v-if="loginStrategy === 'user'"> -->
        <div class="form-content">
          <div v-if="!isAdminSelected" class="pt-1 mb-4">
            <a
              class="btn btn-outline-dark"
              role="button"
              style="text-transform: none"
              @click="userLogin()"
            >
              <img
                width="20px"
                style="margin-bottom: 3px; margin-right: 5px"
                alt="Google sign-in"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
              />
              Đăng nhập với Google
            </a>
          </div>
          <div v-else class="admin-login__container">
            <div class="form-input username">
              <input
                ref="username"
                type="text"
                placeholder="Tên đăng nhập"
                class="input"
              />
              <div v-if="inputError.username" class="input-error">
                {{ inputError.username }}
              </div>
            </div>
            <div class="form-input password">
              <input
                ref="password"
                type="password"
                placeholder="Mật khẩu"
                class="input"
              />
              <div v-if="inputError.password" class="input-error">
                {{ inputError.password }}
              </div>
            </div>
            <button class="btn btn-outline-dark login-btn">Đăng nhập</button>
          </div>
        </div>
        <!-- </form> -->
      </form>
    </div>
    <div class="container-right">
      <img
        height="100%"
        width="100%"
        alt="background"
        src="~assets/img/beerBG.jpeg"
      />
    </div>
    <base-dialog
      v-if="showDialog"
      :title="'Wrong credential'"
      @close="confirmError()"
    >
      <template #default>
        <h3>Đăng nhập không thành công!</h3>
      </template>
    </base-dialog>
  </div>
</template>
<script>
import BaseDialog from '../components/Modal/BaseDialog.vue'
export default {
  components: {
    BaseDialog,
  },
  layout: 'unauth',
  data() {
    return {
      loginStrategy: 'admin',
      loginData: {
        username: '',
        password: '',
      },
      inputError: {
        username: null,
        password: null,
      },
      showDialog: false,
    }
  },
  computed: {
    isAdminSelected() {
      return this.loginStrategy === 'admin'
    },
  },
  mounted() {
    if (this.$auth.loggedIn) this.$router.push('/')
  },
  methods: {
    userLogin() {
      try {
        this.$auth.loginWith('google', {
          params: { prompt: 'select_account' },
        })
      } catch (err) {
        console.log(err)
      }
    },
    haveError(loginData) {
      const inputError = {
        username:
          loginData.username === '' ? 'Tên đăng nhập không được để trống' : null,
        password:
          loginData.password === '' ? 'Mật khẩu không được để trống' : null,
      }
      this.inputError = inputError
      for (const key in inputError) {
        if (inputError[key]) {
          this.$refs[key].focus()
          return true
        }
      }
      return false
    },
    async adminLogin() {
      this.loginData = {
        username: this.$refs.username.value.trim(),
        password: this.$refs.password.value.trim(),
      }
      if (this.haveError(this.loginData)) return
      try {
        await this.$auth.loginWith('local', {
          data: this.loginData,
        })
        this.$router.push('/')
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.showDialog = true
        }
      }
    },
    changeLoginStrategy(strategy) {
      this.loginStrategy = strategy
    },
    confirmError() {
      this.showDialog = false
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~assets/scss/variables';
.container {
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  max-width: 100vw;
  margin: 0;
  display: flex;
  align-items: center;
}
.container-left {
  height: 100%;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.container-left__top {
  width: 80%;
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  /* justify-content: space-between; */
}
.logo {
  width: fit-content;
}
.slogan {
  width: 60%;
  font-weight: bold;
  font-size: 35px;
  text-align: center;
}
.login-section {
  padding: 10px 10px;
  border: 1px solid #c0b7b7;
  border-radius: 8px;
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
.form-title {
  font-weight: 400;
  font-size: 30px;
  margin-bottom: 20px;
}
.option-choose {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: fit-content;
  padding: 5px;
}
.login-option {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 150px;
  height: 90px;
  margin: 0 20px;
  border: 1px solid rgb(153, 134, 134);
  border-radius: 5px;
}
.login-option:hover {
  border: 1px solid $red;
}
.login-option.selected {
  color: $red;
  border: 1px solid $red;
}
.login-option.selected::after {
  text-align: center;
  content: '✓';
  position: absolute;
  bottom: -7px;
  right: -7px;
  height: 25px;
  width: 25px;
  border-radius: 50%;
  border: 1px solid $red;
  background: $red;
  color: $white;
}
.option-description {
  margin-bottom: 10px;
}
.form-content {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* align-items: center; */
}
.container-right {
  height: 100%;
  width: 50%;
  margin-left: auto;
  margin-right: 40px;
}
.admin-login__container {
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
}
.input {
  width: 230px;
  padding: 5px 10px;
  border: 1px solid #c0c0b4;
  border-radius: 5px;
  margin: 20px 0;
}
.input:focus {
  outline: none;
  border: 1px solid $red;
}
.form-input {
  height: fit-content;
  width: fit-content;
  position: relative;
}
.input-error {
  color: $red;
}

.login-btn {
  margin-top: 30px;
  height: fit-content;
  width: fit-content;
  padding: 5px 25px;
}

@media (min-width: 1025px) {
  .h-custom-2 {
    height: 80%;
  }
}
</style>
