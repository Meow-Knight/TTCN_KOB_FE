<template>
  <div class="card-container">
    <div class="image">
      <nuxt-link :to="beerURL" class="link">
        <img :src="beerImg" alt="Beer image" height="200px" width="230px" />
      </nuxt-link>
      <div class="discount-label">
        {{ beer.discount ? beer.discount : defaultStat.discount }}
      </div>
    </div>
    <div class="variant">
      {{ beer.variant ? beer.variant : defaultStat.variant }}
    </div>
    <div class="name">
      <nuxt-link :to="beerURL" class="link">{{ beer.name }}</nuxt-link>
    </div>
    <div class="price">
      <div class="after-discount">{{ afterDiscount + 'đ' }}</div>
      <div class="origin-price">{{ beer.price + 'đ' }}</div>
    </div>
    <div class="review-badge">
      {{ beer.review ? beer.review : defaultStat.review }}
    </div>
    <div class="action">
      <button
        class="button"
        @click="changeCartAfterMutate({ item: beer, amount: 1, action: 'add' })"
      >
        Add
      </button>
      <button
        class="button"
        @click="changeCartAfterMutate({ item: beer, amount: 1, action: 'add' })"
      >
        Buy now
      </button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  props: ['beer'],
  data() {
    return {
      defaultStat: {
        img: '~assets/img/beer-img-default.png',
        discount: 0,
        variant: 'Bia Heineken',
        review: 'Bia ngon',
      },
    }
  },
  computed: {
    afterDiscount() {
      return this.beer.discount
        ? Math.round((this.beer.price * (1 - this.beer.discount / 100)) / 100) *
            100
        : this.beer.price
    },
    beerURL() {
      return '/beers/' + this.beer.id
    },
    beerImg() {
      return this.beer.img
        ? this.beer.img
        : require('../../assets/img/beer-img-default.jpg')
    },
  },
  // we need some methods from cart mutations to react to add or buy beer
  methods: {
    ...mapMutations({
      changeCartAfterMutate: 'cart/changeCartAfterMutate',
    }),
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';
.card-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 400px;
  width: 300px;
  padding: 10px 15px;
  color: $black;
  background: $white;
  position: relative;
  border-radius: 10px;
  transition: 0.3s ease-in-out;
}

.link {
  text-decoration: none;
  color: $black;
}

.discount-label {
  position: absolute;
  top: 10px;
  right: 15px;
  padding: 3px 17px;
  height: fit-content;
  width: fit-content;
  color: $white;
  background: $red;
  border-radius: 6px;
}

.variant {
  width: 100%;
  font-weight: 100;
  text-align: start;
  margin-bottom: 8px;
}

.name {
  width: 100%;
  text-align: start;
  font-weight: 700;
  margin-bottom: 8px;
}

.price {
  width: 100%;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .after-discount {
    color: $red;
  }
  .origin-price {
    text-decoration: line-through;
  }
}

.review-badge {
  text-align: center;
}

.action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 60%;
  .button {
    padding: 4px 8px;
    background: rgb(240, 235, 235);
    color: $red;
    cursor: pointer;
    border-radius: 6px;
    transition: 0.3s ease-in-out;
    cursor: pointer;
    border: none;
    border-radius: 3px;
  }
  .button:hover {
    color: $white;
    background: $red;
  }
}

.card-container:hover {
  transform: scale(1.07);
}
</style>
