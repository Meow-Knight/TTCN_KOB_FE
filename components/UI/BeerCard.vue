<template>
  <div class="card-wrapper">
    <div class="card-container">
      <div class="image">
        <nuxt-link :to="beerURL" class="link">
          <img :src="beerImg" alt="Beer image" height="100%" width="100%" />
        </nuxt-link>
        <div v-if="beer.discount_percent" class="discount-label">
          {{ (-beer.discount_percent || defaultStat.discount_percent) + '%' }}
        </div>
      </div>
      <!-- <div class="variant">
      {{ beer.variant || defaultStat.variant }}
    </div> -->
      <div class="name">
        <nuxt-link :to="beerURL" class="link">{{ beer.name }}</nuxt-link>
      </div>

      <div class="price">
        <div class="after-discount">
          {{
            priceFormat(afterDiscount(beer.price, beer.discount_percent)) + 'đ'
          }}
        </div>
        <div v-if="beer.discount_percent" class="origin-price">
          {{ priceFormat(beer.price) + 'đ' }}
        </div>
      </div>
      <div class="review-badge">
        {{ beer.review || defaultStat.review }}
      </div>
      <div class="action">
        <button
          class="button"
          @click="addNewItem({ beer: beer.id, amount: 1 })"
        >
          Add
        </button>
        <button
          class="button"
          @click="addNewItemAndBuy({ beer: beer.id, amount: 1 })"
        >
          Buy now
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { priceFormat, afterDiscount } from '~/helper/helper'
export default {
  props: ['beer'],
  data() {
    return {
      defaultStat: {
        img: '~assets/img/beer-img-default.png',
        discount_percent: 0,
        variant: 'Bia Heineken',
        review: 'Bia ngon',
      },
    }
  },
  computed: {
    beerURL() {
      return '/beers/' + this.beer.id
    },
    beerImg() {
      return this.beer.photo
        ? this.beer.photo
        : require('../../assets/img/beer-img-default.jpg')
    },
  },
  // we need some methods from cart mutations to react to add or buy beer
  methods: {
    ...mapMutations({
      changeCartAfterMutate: 'cart/changeCartAfterMutate',
    }),
    ...mapActions({
      addNewItem: 'cart/addNewItem',
      addNewItemAndBuy: 'cart/addNewItemAndBuy',
    }),
    priceFormat,
    afterDiscount,
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';

.card-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 125%;
  height: 0;
}

.card-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 5%;
  color: $black;
  background: $white;
  border-radius: 10px;
  transition: 0.3s ease-in-out;
}

.image {
  height: 45%;
  width: 55.55%;
}

.link {
  text-decoration: none;
  color: $black;
}

.discount-label {
  position: absolute;
  top: 5%;
  right: 5%;
  padding: 3px 14px;
  height: fit-content;
  width: 60px;
  text-align: center;
  color: $white;
  background: $red;
  border-radius: 10px;
}

.variant {
  width: 100%;
  font-weight: 100;
  text-align: start;
  height: 10%;
}

.name {
  width: calc(100%);
  text-align: start;
  font-weight: 700;
  font-size: 90%;
  padding: 10px 0 8px 0;
  height: fit-content;
  line-height: 1.1;
  min-height: calc(15%);

  .link {
    width: calc(100%);
    height: calc(100%);
    -webkit-box-orient: vertical;
    display: inline-block;
    overflow: hidden !important;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-font-smoothing: antialiased;
    display: -webkit-box;
  }
}

.price {
  width: 100%;
  height: 10%;
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
  height: 10%;
}

.action {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  min-width: 60%;
  height: 15%;
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
  transform: scale(1.05);
}
</style>
