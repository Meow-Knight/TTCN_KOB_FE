<template>
<div class="bg-container">
  <section class="ftco-section">
		<div class="container">
			<div class="row justify-content-center full-height">
				<div class="col-md-6 col-lg-4 center-vertical">
					<div class="login-wrap w-100">
		      	<h3 class="mb-4 text-center text-light">Admin Login</h3>
		      	<form action="#" class="signin-form">
		      		<div class="form-group">
		      			<input v-model="username" type="text" class="form-control" placeholder="Username" required>
		      		</div>
	            <div class="form-group">
	              <input id="password-field" v-model="password" type="password" class="form-control" placeholder="Password" required>
	            </div>
	            <div class="form-group">
	            	<button type="submit" class="form-control btn btn-primary submit px-3 bg-yellow" @click.prevent="login()" >Sign In</button>
	            </div>
	          </form>
		      </div>
				</div>
			</div>
		</div>
	</section>
</div>
</template>
<script>
export default {
  layout: 'unauth',
  data () {
    return {
      username: "",
      password: ""
    }
  },
  methods: {
    async login() {
      try {
        const data = {username: this.username, password: this.password};
        console.log(data);
        try {
          const response = await this.$auth.loginWith('local', {data});
          console.log(response)
        } catch (err) {
          console.log(err)
        }
      } catch (error) {
        console.log(error);
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
.bg-container {
  background-image: url(https://res.cloudinary.com/ddqzgiilu/image/upload/v1640406388/SGroup/KOB/close-up-bar-tender-filling-beer-from-bar-pump_1_lkctlk.jpg);
  background-position: center;
  background-size: cover;
  height: 100vh;
}
.login-wrap {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 20px;
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
.form-control {
  height: 50px;
  color: white !important;
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 40px;
  padding-left: 20px;
  padding-right: 20px;
  -webkit-transition: 0.3s;
  -o-transition: 0.3s;
  transition: 0.3s;
}
.form-control::placeholder {
  color: white !important;
}
.full-height {
  height: 100vh;
}

.center-vertical {
  display: flex;
  align-items: center;
}

.bg-yellow {
  background: rgb(76 178 183 / 91%);
}
</style>
