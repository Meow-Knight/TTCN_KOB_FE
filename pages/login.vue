<template>
  <div class="container">
    <section class="vh-100">
      <div class="container-fluid">
        <div class="row">
          <div class="col-sm-6 text-black">
            <div class="px-5 ms-xl-4 logo">
              <!-- <span class="h1 fw-bold mb-0">Logo</span> -->
              <img
                width="150px"
                style="object-fit: cover"
                src="~assets/img/logo3.png"
                alt=""
              />
            </div>

            <div
              class="d-flex align-items-center custom-height px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5"
            >
              <form style="width: 23rem">
                <h3 class="fw-normal mb-3 pb-3" style="letter-spacing: 1px">
                  Log in
                </h3>

                <div class="form-outline mb-4">
                  <p class="fw-normal mb-3 pb-3" style="letter-spacing: 1px">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea
                    recusandae atque doloribus rem ipsum aliquid consequuntur?
                    Quae!
                  </p>
                </div>
                <div class="pt-1 mb-4">
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
                    Login with Google
                  </a>
                </div>
              </form>
            </div>
          </div>
          <div class="col-sm-6 px-0 d-none d-sm-block">
            <img
              src="~/assets/img/beerBG.jpeg"
              class="bg-image-vertical"
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  layout: 'unauth',
  computed: {},
  methods: {
    userLogin() {
      try {
        this.$auth.loginWith('google', {
          params: { prompt: 'select_account' },
        })
        this.$router.push('/dashboard')
      } catch (err) {
        console.log(err)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~assets/scss/variables';
.container {
  overflow: hidden;
}
.logo {
  margin-left: -2rem !important;
}
.bg-image-vertical {
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: right center;
  background-size: auto 100%;
  object-fit: cover;
}
.custom-height {
  height: 80%;
}
@media (min-width: 1025px) {
  .h-custom-2 {
    height: 80%;
  }
}
</style>
