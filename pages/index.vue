<template>
  <div class="container">
    <section class="slider">
      <img src="~assets/img/homepage-top-banner.jpg" class="top-image" />
    </section>
    <section class="main-content">
      <section class="home-policy"></section>
      <section class="featured-product">
        <div class="title">SẢN PHẨM BÁN CHẠY</div>
        <beer-collection :beers="featuredBeers"></beer-collection>
      </section>
      <section class="home-banner"></section>
      <section class="home-collection">
        <div class="title">King Of Beer Collection</div>
        <beer-collection :beers="beers"></beer-collection>
      </section>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import BeerCollection from '../components/BeerCollection.vue'
export default {
  components: {
    BeerCollection,
  },
  layout: 'default',
  data() {
    return {
      beers: [],
      featuredBeers: [],
    }
  },
  computed: {
    user() {
      return this.$auth.user
    },
  },
  async created() {
    if (this.user && this.user.is_staff) {
      return this.$router.push('/dashboard')
    }
    const URL = '/beer'
    if (process.client) {
      const authToken = localStorage.getItem('auth._token.google')
      const response = await axios.get(`/api/v1${URL}`, {
        headers: { Authorization: authToken },
      })
      this.beers = Array(5)
        .fill(response.data.results)
        .reduce((prev, cur) => [...prev, ...cur])
      this.featuredBeers = this.beers.slice(0, 5)
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/_variables.scss';
h1 {
  color: $red;
}
.container {
  width: 100%;
  margin: 0;
  padding: 0 0 40px 0;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgb(245, 245, 245);
}
.slider {
  height: 90px;
  margin-bottom: 300px;
  width: 100%;
  position: relative;
}
.top-image {
  position: absolute;
  top: -105px;
  left: 0;
  height: 450px;
  width: 100%;
}
.main-content {
  width: 90%;
}
.featured-product {
  width: 100%;
}

.title {
  font-weight: 600;
  font-size: 30px;
  text-align: center;
  position: relative;
  margin-bottom: 40px;
  margin-top: 20px;
}

.title::after {
  position: absolute;
  content: '';
  width: 20%;
  height: 2px;
  background: $black;
  bottom: -5px;
  left: 40%;
}
</style>
