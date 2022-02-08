<template>
  <div class="breadcrumb">
    <div v-for="(item, index) in items" :key="index" class="breadcrumb__item">
      <nuxt-link :to="item.path">{{ item.name }} </nuxt-link>
      <span v-if="index < items.length - 1" class="breadcrumb__arraw">></span>
    </div>
  </div>
</template>

<script>
export default {
  // here we will expect name props from detail pages, e.g: heineken beer, Nha may bia Heineken,...
  // paths and matcher will be use to generate link from current route path
  props: ['name'],
  data() {
    return {
      paths: [],
      matcher: {
        '/': 'Trang chủ',
        '/dashboard': 'Quản lý',
        '/dashboard/beers': 'Sản phẩm',
        '/dashboard/sales': 'Doanh thu',
        '/dashboard/orders': 'Đơn hàng',
        '/dashboard/producers': 'Nhà sản xuất',
        '/dashboard/vouchers': 'Khuyến mãi',
        '/dashboard/vouchers/addVoucher': 'Thêm khuyến mãi',
        '/dashboard/beers/addBeer': 'Thêm mới bia',
        '/dashboard/shipment': 'Lô hàng',
        '/dashboard/shipment/addShipment': 'Thêm lô hàng',
        '/dashboard/customers': 'Khách hàng',
      },
    }
  },
  computed: {
    items() {
      // we will map the paths generate from current route path to breadcrumb items
      // only the detail path (e.g: detail beer, detail producer) that we can't get
      // the beer|producer name, then we will take the name prop from outside
      return this.paths.map((val, index) =>
        this.name && index === this.paths.length - 1
          ? { path: val, name: this.name }
          : {
              path: val,
              name: this.matcher[val],
            }
      )
    },
  },
  created() {
    // map the page's path to breadcrumb levels
    const paths = ['/']
    this.$route.fullPath.split('/').reduce((prev, cur) => {
      paths.push(prev + '/' + cur)
      return prev + '/' + cur
    })
    this.paths = paths
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';

a {
  text-decoration: none !important;
  color: $black;
}
.breadcrumb {
  //   background-color: transparent;
  &__item:last-of-type {
    a {
      color: $gray !important;
    }
  }
  &__arraw {
    margin-right: 5px;
  }
}
</style>
