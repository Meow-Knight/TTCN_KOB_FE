<template>
  <div v-if="isInitialLoading" style="height: 100vh"></div>
  <div v-else class="container">
    <div class="product-intro">
      <div class="product-intro-image">
        <div class="img-slide">img list</div>
        <div class="img-show">img show</div>
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
          <div class="after-discount">{{ afterDiscount + '₫' }}</div>
          <div class="origin-price">{{ beer.price + '₫' }}</div>
          <div class="saving">
            {{ '(Bạn đã tiết kiệm được ' + saving + '₫)' }}
          </div>
        </div>
        <ul style="padding-left: 20px">
          <li class="type">Loại bia: Heineken</li>
          <li class="alcohol">Nồng độ cồn: {{ beer.alcohol_concentration }}</li>
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
          <button class="add-to-cart">
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
          <button class="buy-now">Mua ngay</button>
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
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  layout: 'default',
  data() {
    return {
      isInitialLoading: true,
      beer: {
        alcohol_concentration: null,
        beer_unit: null,
        bottle_amount: null,
        capacity: null,
        describe: null,
        name: null,
        origin_nation: null,
        price: null,
        producer: null,
        discount: null,
      },
      purchaseNumber: 1,
    }
  },
  computed: {
    beerId() {
      return this.$router.currentRoute.params.id
    },
    afterDiscount() {
      return this.beer.price
        ? this.beer.discount
          ? Math.round(
              (this.beer.price * (1 - this.beer.discount / 100)) / 100
            ) * 100
          : this.beer.price
        : 0
    },
    saving() {
      return this.beer.price ? this.beer.price - this.afterDiscount : 0
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
  },
  async created() {
    const BEER_URL = '/beer/'
    if (process.client) {
      const authToken = localStorage.getItem('auth._token.google')
      this.isInitialLoading = true

      try {
        const responseBeer = await axios.get(
          `/api/v1${BEER_URL}${this.beerId}`,
          {
            headers: { Authorization: authToken },
          }
        )
        this.beer = {
          ...responseBeer.data,
          beer_unit: responseBeer.data.beer_unit.name,
          origin_nation: responseBeer.data.origin_nation.name,
          producer: responseBeer.data.producer.name,
        }
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
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/_variables.scss';

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
  width: 400px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.img-slide {
  width: 25%;
  height: 100%;
  border: 1px solid rgb(102, 102, 92);
}
.img-show {
  width: 70%;
  height: 100%;
  border: 1px solid salmon;
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
  margin: 30px 0 0 15px;
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
  /* height: fit-content; */
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
    margin-bottom: 10px;
    font-weight: 500;
    font-size: 30px;
    width: 100%;
    text-align: center;
    background: rgb(245, 245, 245);
  }
}
</style>
