<template>
  <div v-if="isInitialLoading" class="initial-loading">We are loading</div>
  <div v-else class="container">
    <div class="product-intro">
      <div class="product-intro-image">
        <div class="img-show">
          <div id="img-zoom-lens" class="img-zoom-lens"></div>
          <img
            id="source-image"
            :src="displayPhoto"
            height="100%"
            width="100%"
            class="display-image"
          />
          <div id="zoom-result" class="zoom-result"></div>
        </div>
        <div id="img-slide" class="img-slide">
          <Slide
            :item-height="slideHeight"
            :item-width="slideHeight"
            :item-type="'image'"
          >
            <div v-for="photo in beer.photos" :key="photo" class="scroll-item">
              <img
                :src="photo"
                class="item"
                :class="{ selected: photo === selectedPhoto }"
                @click="changeDisplayPhoto(photo)"
              />
            </div>
          </Slide>
        </div>
      </div>
      <div class="product-content">
        <div class="content-header">
          <h4 class="name">
            {{ beer.name }}
          </h4>
          <div class="categories">
            <span class="brand">Thương hiệu: Heineken</span>
            <span>|</span>
            <span class="type">Loại: Bia Heineken</span>
            <span>|</span>
            <span class="id">Mã sản phẩm: HEINE092716</span>
          </div>
        </div>
        <div class="review-badge">Bia khá ngon</div>
        <div class="price">
          <div class="after-discount">
            {{
              priceFormat(afterDiscount(beer.price, beer.discount_percent)) +
              '₫'
            }}
          </div>
          <div class="origin-price">{{ priceFormat(beer.price) + '₫' }}</div>
          <div class="saving">
            {{ '(Bạn đã tiết kiệm được ' + priceFormat(saving) + '₫)' }}
          </div>
        </div>
        <ul style="padding-left: 20px">
          <li class="type">Loại bia: Heineken</li>
          <li class="alcohol">
            Nồng độ cồn: {{ beer.alcohol_concentration }}%
          </li>
          <li class="capacity">
            {{ size }}
          </li>
          <li class="origin-nation">Xuất xứ: {{ beer.origin_nation }}</li>
          <li class="producer">Nơi sản xuất: {{ beer.producer }}</li>
          <li class="note">
            <strong>Lưu ý: </strong>Sản phẩm dành cho người trên 18 tuổi và
            không dành cho phụ nữ mang thai. Thưởng thức có trách nhiệm, đã sử
            dụng đồ uống có cồn thì không lái xe!
          </li>
          <li class="deliver-estimate">
            Thời gian giao hàng dự kiến
            <ol>
              <li>Nội thành TP Hồ Chí Minh, TP Hà Nội: trong vòng 24 giờ</li>
              <li>Ngoại thành TP Hồ Chí Minh, TP Hà Nội: trong vòng 24 giờ</li>
              <li>Khu vực miền Trung: trong vòng 24 giờ</li>
            </ol>
          </li>
        </ul>
        <div class="order-amount">
          <div class="left">Số lượng</div>
          <div class="right">
            <button
              class="change-amount"
              @click="changePurchaseNumber('decrease')"
            >
              -
            </button>
            <input
              :value="purchaseNumber"
              class="number"
              @input="validateInput"
            />
            <button
              class="change-amount"
              @click="changePurchaseNumber('increase')"
            >
              +
            </button>
          </div>
        </div>
        <div class="action">
          <button
            class="add-to-cart"
            @click="
              addNewItem({
                beer: beer.id,
                amount: purchaseNumber,
              })
            "
          >
            <svg
              enable-background="new 0 0 15 15"
              viewBox="0 0 15 15"
              x="0"
              y="0"
              class="icon-add-to-cart"
            >
              <g>
                <g>
                  <polyline
                    fill="none"
                    points=".5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                  ></polyline>
                  <circle cx="6" cy="13.5" r="1" stroke="none"></circle>
                  <circle cx="11.5" cy="13.5" r="1" stroke="none"></circle>
                </g>
                <line
                  fill="none"
                  stroke-linecap="round"
                  stroke-miterlimit="10"
                  x1="7.5"
                  x2="10.5"
                  y1="7"
                  y2="7"
                ></line>
                <line
                  fill="none"
                  stroke-linecap="round"
                  stroke-miterlimit="10"
                  x1="9"
                  x2="9"
                  y1="8.5"
                  y2="5.5"
                ></line>
              </g>
            </svg>
            <span>Thêm vào giỏ hàng</span>
          </button>
          <button
            class="buy-now"
            @click="
              addNewItemAndBuy({
                beer: beer.id,
                amount: purchaseNumber,
              })
            "
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
    <div class="product-description">
      <div class="description">
        <div class="header">MÔ TẢ SẢN PHẨM</div>
        <div class="description-content">
          <ul>
            <li>{{ beer.describe }}</li>
            <li>a</li>
          </ul>
        </div>
        <div class="review">
          <div class="header">ĐÁNH GIÁ</div>
          <div class="review-content">
            <ul>
              <li>a</li>
              <li>a</li>
              <li>a</li>
              <li>a</li>
              <li>a</li>
              <li>a</li>
              <li>a</li>
              <li>a</li>
              <li>a</li>
              <li>a</li>
              <li>a</li>
              <li>a</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="recommend">
        <div class="header">SẢN PHẨM GỢI Ý</div>
        <div class="recommend-items">
          <beer-collection
            :beers="same_producer_beers"
            :num-columns="1"
            :column-width="1"
          ></beer-collection>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { imageZoom, priceFormat, afterDiscount } from '~/helper/helper'
import Slide from '~/components/Slide/index.vue'
import BeerCollection from '~/components/BeerCollection.vue'
export default {
  components: { BeerCollection },
  layout: 'default',
  component: { Slide, BeerCollection },
  data() {
    return {
      isInitialLoading: true,
      beer: {
        id: null,
        alcohol_concentration: null,
        beer_unit: null,
        bottle_amount: null,
        capacity: null,
        describe: null,
        name: null,
        origin_nation: null,
        price: null,
        producer: null,
        discount_percent: null,
        photos: [],
        expiration_date: null,
        note: null,
      },
      purchaseNumber: 1,
      slideHeight: '50px',
      selectedPhoto: null,
      same_producer_beers: [],
    }
  },
  computed: {
    beerId() {
      return this.$router.currentRoute.params.id
    },
    saving() {
      return this.beer.price
        ? this.beer.price -
            afterDiscount(this.beer.price, this.beer.discount_percent)
        : 0
    },
    size() {
      return (
        'Dung tích: ' +
        this.beer.capacity +
        ' x ' +
        this.beer.bottle_amount +
        ' ' +
        this.beer.beer_unit
      )
    },
    // set display photo source
    displayPhoto() {
      return this.selectedPhoto
        ? this.selectedPhoto
        : this.beer.photos[0]
        ? this.beer.photos[0]
        : require('~/assets/img/beer-img-default.jpg')
    },
    // get some data needed for add to cart action
    addToCartData() {
      const { id, name, price } = this.beer
      return {
        id,
        name,
        price,
        discount_percent: this.beer.discount_percent,
        photo: this.beer.photos[0],
      }
    },
  },
  watch: {
    // we want to wait for both XHR result and and the component to
    // be mounted, after that we can access DOM's elements
    isInitialLoading() {
      this.$nextTick(() => {
        imageZoom('source-image', 'zoom-result', 'img-zoom-lens')
        // also we will need to access slider to get height for items
        this.slideHeight =
          document.getElementById('img-slide').offsetHeight + 'px'
      })
    },
    // we will need to change result div (the div which will show the zoom
    // result) source every time selectedPhoto change
    selectedPhoto() {
      this.$nextTick(() => {
        document.getElementById('zoom-result').style.backgroundImage =
          "url('" + this.selectedPhoto + "')"
      })
    },
  },
  async created() {
    const BEER_URL = '/beer/'
    if (process.client) {
      const authToken = localStorage.getItem('auth._token.google')
      this.isInitialLoading = true

      try {
        const {
          data: { details, photos, same_producer_beers: sameProducerBeers },
        } = await this.$axios.get(`/api/v1${BEER_URL}${this.beerId}/info`, {
          headers: { Authorization: authToken },
        })
        this.beer = {
          ...details,
          beer_unit: details.beer_unit.name,
          origin_nation: details.origin_nation.name,
          producer: details.producer.name,
          photos,
        }
        this.same_producer_beers = sameProducerBeers
        this.selectedPhoto = this.beer.photos[0]
        this.isInitialLoading = false
      } catch (err) {
        console.log(err.response)
        if (err.response && err.response.status === 404) throw err
      }
    }
  },
  methods: {
    changePurchaseNumber(type) {
      // should check for in-stored for adding more
      this.purchaseNumber =
        type === 'increase'
          ? this.purchaseNumber + 1
          : this.purchaseNumber <= 1
          ? this.purchaseNumber
          : this.purchaseNumber - 1
    },
    validateInput($event) {
      const parseNumber = +$event.target.value
      if (Number.isNaN(parseNumber) || parseNumber <= 0) {
        this.$forceUpdate()
        return
      }
      this.purchaseNumber = parseNumber
    },
    changeDisplayPhoto(source) {
      this.selectedPhoto = source
    },
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
@import '~/assets/scss/_variables.scss';

.initial-loading {
  width: 100%;
  min-height: 80vh;
  background: $white2;
  text-align: center;
  margin-top: -110px;
  padding-top: 100px;
}

.container {
  width: 100%;
  min-height: 93vh;
  margin: -110px 0 0 0;
  padding: 120px 0 40px 0;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgb(245, 245, 245);
}

.product-intro {
  width: 100%;
  height: fit-content;
  padding: 40px 50px;
  display: grid;
  grid-template-columns: 1.5fr 2.5fr;
  justify-items: center;
}
.product-intro-image {
  width: 450px;
  height: 600px;
  display: flex;
  flex-direction: column;
  margin-left: 50px;
}
.img-slide {
  width: 100%;
  height: 19%;
  margin-top: 20px;
}
.img-show {
  width: 100%;
  height: 66.67%;
  position: relative;
  border: 2px solid $red;
}

.img-zoom-lens {
  position: absolute;
  border: 1px solid #3a3838;
  background: #f5f3f3;
  opacity: 0.5;
  width: 15%;
  height: 15%;
  visibility: hidden;
}

.zoom-result {
  border: 2px solid #6a6e69;
  width: 120%;
  height: 120%;
  position: absolute;
  top: -2px;
  right: -120%;
  visibility: hidden;
  z-index: 10;
}

.product-content {
  width: 90%;
  height: fit-content;
  padding: 10px 10px;
  background: $white;
}
.categories {
  font-style: italic;
  font-weight: 100;
  width: fit-content;
  position: relative;
  margin-bottom: 10px;
}
.categories::after {
  position: absolute;
  content: '';
  width: 100%;
  height: 0.1px;
  left: 0;
  bottom: -2px;
  background: rgb(245, 245, 245);
}
.review-badge {
  margin-bottom: 5px;
}
.price {
  width: 60%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin-bottom: 10px;
}
.after-discount {
  font-size: 25px;
  color: $red;
  font-weight: bold;
}
.origin-price {
  text-decoration: line-through;
}
.price::after {
  position: absolute;
  content: '';
  width: 100%;
  height: 0.1px;
  left: 0;
  bottom: -1px;
  background: rgb(233, 227, 227);
}
.order-amount {
  margin: 30px 0 10px 5px;
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    font-weight: bold;
    font-size: 20px;
    margin: 0 0 7px 25px;
  }
  .right {
    display: flex;
    align-items: center;
    width: fit-content;
  }
  .number {
    height: 30px;
    width: 80px;
    text-align: center;
    background: $white;
    border: 0.5px solid rgb(173, 161, 161);
    border-width: thin;
  }
  .number:focus {
    outline: none;
    border: 1px solid rgb(95, 92, 92);
  }
  .change-amount {
    padding: 0;
    height: 30px;
    width: 30px;
    border: 0.5px solid rgb(173, 161, 161);
    background: $white;
    cursor: pointer;
  }
  .change-amount:hover {
    background: rgb(207, 78, 78);
    color: $white;
  }
}
.action {
  margin: 30px 0 10px 15px;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  button {
    cursor: pointer;
    padding: 10px 30px;
    border: none;
    border-radius: 3px;
  }
}
.add-to-cart {
  background: rgba(208, 1, 27, 0.08);
  color: $red;
  display: flex;
  align-items: center;
}
.add-to-cart:hover {
  background: rgb(230, 201, 207);
}
.icon-add-to-cart {
  color: rgb(208, 1, 27);
  cursor: pointer;
  display: block;
  fill: rgb(208, 1, 27);
  height: 20px;
  letter-spacing: normal;
  line-height: 24px;
  margin-right: 10px;
  overflow-x: hidden;
  overflow-y: hidden;
  position: relative;
  stroke: rgb(208, 1, 27);
  text-align: center;
  text-indent: 0px;
  text-rendering: auto;
  text-shadow: none;
  text-size-adjust: 100%;
  text-transform: capitalize;
  width: 20px;
  word-spacing: 0px;
  writing-mode: horizontal-tb;
}
.buy-now {
  background: $red;
  color: $white;
}
.buy-now:hover {
  background: rgb(231, 65, 96);
}

.product-description {
  width: 100%;
  height: fit-content;
  padding: 40px 50px;
  display: grid;
  grid-template-columns: 2.8fr 1.2fr;
  justify-items: center;
}

.description {
  width: 100%;
  background: $white;
  padding: 30px 20px;
  .header {
    padding: 5px 10px;
    margin-bottom: 10px;
    font-weight: 500;
    font-size: 30px;
    width: 100%;
    text-align: start;
    background: rgb(245, 245, 245);
  }
}

.recommend {
  width: 100%;
  height: fit-content;
  padding: 0 20px;
  .header {
    color: $red;
    padding: 0 10px;
    margin-bottom: 20px;
    font-weight: 500;
    font-size: 30px;
    width: 100%;
    text-align: center;
    background: rgb(245, 245, 245);
  }
  .recommend-items {
    width: 80%;
    margin: 0 auto;
  }
}

button {
  transition: 0.3s ease-in-out;
}
button:hover {
  transition: 0.3s ease-in-out;
}
</style>
