<template>
  <!-- <with-loading :is-loading="isLoading"> -->
  <div class="container">
    <section class="slider">
      <img src="~assets/img/homepage-top-banner.jpg" class="top-image" />
    </section>
    <section class="main-content">
      <div class="search-bar-container">
        <form class="search-form" @submit.prevent="initSearchBeer($event)">
          <input
            ref="searchInput"
            type="text"
            class="search-input"
            placeholder="Ưu đãi lớn từ King of Beer"
            :value="searchQuery"
          />
          <button class="submit-button" type="submit">
            <search-icon
              height="20"
              viewBox="0 0 20 20"
              width="20"
              class="search-icon"
            ></search-icon>
          </button>
        </form>
      </div>
      <div class="main-container">
        <div v-if="isLoading" class="loading-items">Loading...</div>
        <div v-else-if="!searchBeers.length" class="no-item-section">
          <img
            :src="require('~/assets/img/no-item.png')"
            height="300px"
            width="300px"
          />
          <div class="no-item-text">Oops, không tìm thấy kết quả nào</div>
        </div>
        <div v-else class="main">
          <div class="panel">
            <filter-panel
              :set-filtered-items="setFilteredBeers"
              :items="searchBeers"
              :filter-categories="filterCategories"
            >
              <div class="filter-header">
                <svg
                  enable-background="new 0 0 15 15"
                  viewBox="0 0 20 20"
                  height="25px"
                  width="25px"
                  x="0"
                  y="0"
                  stroke="currentColor"
                  class="filter-icon"
                >
                  <g>
                    <polyline
                      fill="none"
                      points="5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-miterlimit="10"
                    ></polyline>
                  </g>
                </svg>
                <span class="filter-header-text">BỘ LỌC BIA</span>
              </div>
            </filter-panel>
          </div>
          <div class="search-result">
            <div v-if="searchQuery" class="search-result-text">
              {{ `Kết quả tìm kiếm cho từ khóa "${searchQuery}"` }}
            </div>
            <div class="sort-options">
              <div class="sort-placeholder">Sắp xếp theo</div>
              <div
                v-for="category in sortCategories"
                :key="category.name"
                class="sort-category"
                :class="{
                  dropdown: category.options.length > 1,
                  closeDropdown: closeDropdown,
                  selected: isSortCategorySelected(category.name),
                }"
                @click="
                  () => {
                    category.options.length <= 1 &&
                      setSortBy({
                        category: category.name,
                        display: category.options[0].display,
                        sortFunc: category.options[0].sortFunc,
                      })
                  }
                "
              >
                <template v-if="category.options.length <= 1">
                  {{ isSortCategorySelected(category.name) || category.title }}
                </template>
                <template v-else>
                  <div class="category-placeholder">
                    {{
                      isSortCategorySelected(category.name) || category.title
                    }}
                  </div>
                  <svg
                    viewBox="0 0 10 6"
                    height="15px"
                    width="15px"
                    class="dropdown-icon"
                    strokeWidth="0.5px"
                  >
                    <path
                      d="M9.7503478 1.37413402L5.3649665 5.78112957c-.1947815.19574157-.511363.19651982-.7071046.00173827a.50153763.50153763 0 0 1-.0008702-.00086807L.2050664 1.33007451l.0007126-.00071253C.077901 1.18820749 0 1.0009341 0 .79546595 0 .35614224.3561422 0 .7954659 0c.2054682 0 .3927416.07790103.5338961.20577896l.0006632-.00066318.0226101.02261012a.80128317.80128317 0 0 1 .0105706.0105706l3.3619016 3.36190165c.1562097.15620972.4094757.15620972.5656855 0a.42598723.42598723 0 0 0 .0006944-.00069616L8.6678481.20650022l.0009529.0009482C8.8101657.07857935 8.9981733 0 9.2045341 0 9.6438578 0 10 .35614224 10 .79546595c0 .20495443-.077512.39180497-.2048207.53283641l.0003896.00038772-.0096728.00972053a.80044712.80044712 0 0 1-.0355483.03572341z"
                      fill-rule="nonzero"
                    ></path>
                  </svg>
                  <div class="category-dropdown-container">
                    <div
                      v-for="option in category.options"
                      :key="option.display"
                      class="dropdown-item"
                      :class="{
                        selected: isSortOptionSelected(
                          category.name,
                          option.display
                        ),
                      }"
                      @click="
                        handleSortOptionSelect({
                          category: category.name,
                          display: option.display,
                          sortFunc: option.sortFunc,
                        })
                      "
                    >
                      {{ option.display }}
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <beer-collection
              v-if="filteredBeers.length"
              :num-columns="4"
              :column-width="1"
              :beers="getSortedBeers"
            ></beer-collection>
            <div v-else class="no-item-match-filter">
              Không có sản phẩm phù hợp yêu cầu
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <!-- </with-loading> -->
</template>

<script>
import SearchIcon from '~/components/UI/SearchIcon.vue'
import FilterPanel from '~/components/FilterPanel.vue'
import BeerCollection from '~/components/BeerCollection.vue'
import { afterDiscount, roleGuard } from '~/helper/helper'
export default {
  components: {
    SearchIcon,
    FilterPanel,
    BeerCollection,
  },
  layout: 'default',
  middleware: [roleGuard(['GUEST', 'CUSTOMER'])],
  data() {
    /**
     * we need to define some data:
     * - searchQuery, URL
     * - searchBeers: result return from XHR calling
     * - isLoading: indicate that XHR is loading
     * - filteredBeers: beers after filtered
     */
    return {
      searchQuery: undefined,
      URL: '/beer/user_search',
      searchBeers: [],
      filteredBeers: [],
      isLoading: true,
      /**
       * filterCategories: an array contain all filter categories, where each category
       * include information about category like title and name (or property to be filter)
       * and an array of filter option
       */
      filterCategories: [
        {
          title: 'Theo khoảng giá',
          name: 'price',
          options: [
            {
              from: 0,
              to: 200000,
              display: 'Dưới 200.000đ',
            },
            { from: 200000, to: 400000, display: 'Từ 200.000đ đến 400.000đ' },
            { from: 400000, to: 600000, display: 'Từ 400.000đ đến 600.000đ' },
            { from: 600000, to: 800000, display: 'Từ 600.000đ đến 800.000đ' },
            { from: 800000, to: Infinity, display: 'Trên 800.000đ' },
          ],
          filterFunc: (object, option) => {
            if (!object.price) return false
            const afterDiscount =
              object.price -
              (1 -
                (object.discount_percent ? object.discount_percent / 100 : 0))
            return afterDiscount >= option.from && afterDiscount < option.to
          },
        },
        {
          title: 'Theo nồng độ cồn',
          name: 'alcohol_concentration',
          options: [
            {
              from: 0,
              to: 4,
              display: 'Dưới 4%',
            },
            { from: 4, to: 5, display: 'Từ 4% đến 5%' },
            { from: 5, to: 6, display: 'Từ 5% đến 6%' },
            { from: 6, to: Infinity, display: 'Trên 6%' },
          ],
          filterFunc: (object, option) =>
            object.alcohol_concentration &&
            object.alcohol_concentration >= option.from &&
            object.alcohol_concentration < option.to,
        },
        {
          title: 'Theo hãng bia',
          name: 'producer',
          options: [
            {
              value: 'Heineken',
              display: 'Heineken',
            },
            {
              value: 'Budweiser',
              display: 'Budweiser',
            },
            {
              value: 'Huda',
              display: 'Huda',
            },
            {
              value: 'Corona',
              display: 'Corona',
            },
          ],
          filterFunc: (object, option) =>
            object.producer && object.producer.name === option.value,
        },
      ],
      /**
       * selected sort object
       */
      sortBy: {
        category: null,
        display: null,
        sortFunc: null,
      },
      // add closeDropdown class to dropdown category, just to close dropdown after clicking
      closeDropdown: false,
    }
  },
  computed: {
    getSortedBeers() {
      return !this.sortBy.category
        ? this.filteredBeers
        : [...this.filteredBeers].sort(this.sortBy.sortFunc)
    },
    /**
     * array of sort category, which include category name (object property used to sort)
     * title and an array of options
     */
    sortCategories() {
      return [
        {
          name: 'name',
          title: 'Tên',
          options: [
            {
              display: 'Tên: từ A - Z',
              sortFunc: (first, second) =>
                first.name.localeCompare(second.name),
            },
            {
              display: 'Tên: từ Z - A',
              sortFunc: (first, second) =>
                second.name.localeCompare(first.name),
            },
          ],
        },
        {
          name: 'price',
          title: 'Giá',
          options: [
            {
              display: 'Giá: Tăng dần',
              sortFunc: (first, second) =>
                afterDiscount(first.price, first.discount_percent) -
                afterDiscount(second.price, second.discount_percent),
            },
            {
              display: 'Giá: Giảm dần',
              sortFunc: (first, second) =>
                afterDiscount(second.price, second.discount_percent) -
                afterDiscount(first.price, first.discount_percent),
            },
          ],
        },
      ]
    },
  },
  watch: {
    // we will watch for route change to init search request
    // the data chain will be route -> searchQuery property -> UI
    // when user submit form, we just have to change the route to match user's input
    $route: {
      immediate: true,
      async handler(to, from) {
        this.searchQuery = to.query.q
        if (process.client) {
          const authToken = this.$auth.strategy.token.get()
          this.isLoading = true
          try {
            const { data: searchBeers } = await this.$axios.get(
              `/api/v1${this.URL}?q=` + (this.searchQuery || ''),
              {
                headers: { Authorization: authToken },
              }
            )
            this.isLoading = false
            this.searchBeers = searchBeers
          } catch (err) {
            console.log(err)
          }
        }
      },
    },
  },
  methods: {
    // set the new filtered list after filtering
    setFilteredBeers(filteredBeers) {
      this.filteredBeers = filteredBeers
    },
    // indicate whether a sort category is selected for dynamic class binding/styling
    isSortCategorySelected(category) {
      return this.sortBy.category === category && this.sortBy.display
    },
    // indicate whether a sort option of a category is selected, used for dynamic
    // class binding/styling
    isSortOptionSelected(category, display) {
      return (
        this.sortBy.category === category && this.sortBy.display === display
      )
    },
    // set new sort object
    setSortBy(sortObject) {
      this.sortBy = { ...sortObject }
    },
    handleSortOptionSelect(sortObject) {
      this.closeDropdown = true
      setTimeout(() => {
        this.closeDropdown = false
      }, 300)
      this.sortBy = { ...sortObject }
      // close dropdown
    },
    afterDiscount,
    // change the route when submitting form
    initSearchBeer(event) {
      this.$router.push('/beers?q=' + this.$refs.searchInput.value.trim())
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/_variables.scss';

.container {
  max-height: none;
  max-width: none;
  padding: 0;
  margin: 0;
}

.slider {
  width: 100%;
  height: 300px;
}

.top-image {
  width: 100%;
  height: 100%;
}

.main-content {
  height: fit-content;
  background: rgb(250, 242, 242);
}

.search-bar-container {
  height: fit-content;
  width: 100%;
  padding: 15px 10px;
  display: flex;
  align-items: center;
  justify-content: start;
}

.search-form {
  height: 50px;
  width: fit-content;
  margin: auto;
  position: relative;
}

.search-input {
  border: 1px solid black;
  padding: 5px 100px 5px 10px;
  border-radius: 3px;
  height: 100%;
  width: 700px;
}

.search-input:focus {
  outline: 1px solid $red;
  border: 1px solid $red;
}

.submit-button {
  height: 40px;
  width: fit-content;
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 3px 30px;
  text-align: center;
  border-radius: 3px;
  background: rgb(196, 96, 96);
  border: none;
  transition: 0.3s;
}

.submit-button:hover {
  background: $red;
  transition: 0.3s;
}

.search-icon {
  color: $white;
}

.main-container {
  height: fit-content;
  width: 100%;
  padding: 30px 0 80px 0;
}

.loading-items {
  width: 100%;
  height: 50vh;
  text-align: center;
}

.no-item-section {
  height: fit-content;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.no-item-text {
  height: fit-content;
  width: fit-content;
  font-size: 30px;
}

.main {
  display: grid;
  grid-template-columns: 20% 80%;
  justify-items: center;
  width: 100%;
}

.panel {
  width: 100%;
  height: fit-content;
  margin: 20px auto 0 0;
}

.filter-header {
  text-align: left;
  height: fit-content;
  margin-bottom: 20px;
}

.filter-header-text {
  font-size: 20px;
  font-weight: 500;
  margin-top: 5px;
}

.filter-icon {
  color: $black;
}

.search-result {
  height: 100%;
  width: 100%;
  padding: 0 20px;
}

.search-result-text {
  margin-bottom: 20px;
  font-style: italic;
  padding-top: 10px;
}

.sort-options {
  padding: 10px 0;
  margin: 20px 0;
  display: flex;
}

.sort-placeholder {
  padding: 3px 0;
  height: fit-content;
}

.sort-option {
  margin-left: 30px;
  padding: 5px 20px;
  height: fit-content;
  width: fit-content;
  background: rgb(233, 228, 227);
  position: relative;
  cursor: pointer;
}

.sort-option:hover {
  color: $red;
}

.sort-option.selected {
  color: $red;
}

.sort-category {
  margin-left: 30px;
  padding: 5px 20px;
  height: fit-content;
  width: fit-content;
  background: rgb(233, 228, 227);
  position: relative;
  cursor: pointer;
}

.sort-category:hover {
  color: $red;
}

.sort-category.selected {
  color: $red;
}

.option-placeholder {
  width: 150px;
  height: fit-content;
  color: inherit;
}

.category-placeholder {
  width: 150px;
  height: fit-content;
  color: inherit;
}

.sort-category.dropdown {
  display: flex;
}

.category-dropdown-container {
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  max-height: 0;
  overflow: hidden;
  z-index: 20;
  border-top: 1px solid rgb(211, 205, 205);
  transition: max-height 0.3s ease;
}

/* .category-dropdown-container.close-dropdown {
  z-index: 10;
} */
.no-hover {
  background: chocolate;
}

.sort-category.dropdown:not(.closeDropdown):hover {
  .category-dropdown-container {
    max-height: 200%;
    transition: max-height 0.3s ease;
  }
}

.dropdown-icon {
  margin: auto 0;
}

.dropdown-item {
  padding: 5px 20px;
  background: rgb(233, 228, 227);
  position: relative;
  cursor: pointer;
}

.dropdown-item::after {
  position: absolute;
  content: '✔';
  top: 5px;
  right: 15px;
  height: 24px;
  width: 24px;
  visibility: hidden;
}

.dropdown-item:hover {
  color: $red;
}

.dropdown-item:hover::after {
  visibility: visible;
}

.dropdown-item.selected {
  color: $red;
}

.dropdown-item.selected::after {
  visibility: visible;
}

.no-item-match-filter {
  margin-top: 50px;
  text-align: center;
  padding-right: 100px;
}
</style>
