<template>
  <div class="filter-panel">
    <slot></slot>
    <div class="content">
      <div
        v-for="category in filterCategories"
        :key="category.name"
        class="category"
      >
        <div class="category-title">{{ category.title }}</div>
        <div
          v-for="(option, index) in category.options"
          :key="index"
          class="category-option-wrapper"
        >
          <input
            type="checkbox"
            class="category-option"
            :name="category.name"
            :checked="
              selectedFilter[category.name] &&
              selectedFilter[category.name].option.display === option.display
            "
            @click="
              handleChangeOption($event)(
                category.name,
                option,
                category.filterFunc
              )
            "
          />
          {{ option.display }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['items', 'setFilteredItems', 'filterCategories'],
  data() {
    return {
      /*
        we expected items prop to be an array of data to be filter
        filterCategories to be an array of filter category, which include
        3 properties: name of the filter category, options of filter category
        and the filter function which will be apply for each item in data array
        of course, the options and filter function will be different in different
        context
     
        we will store all selected filter option in an object, and use the
        category name (property of item) as key
        one filter option will have all it requirement, and a filter function
        that will be applied to filter item
      */
      selectedFilter: [],
    }
  },
  computed: {
    // computed filtered item
    filteredItem() {
      return this.items.filter((item) =>
        Object.values(this.selectedFilter).every(({ option, filterFunc }) =>
          filterFunc(item, option)
        )
      )
    },
  },
  watch: {
    // we want to watch both items prop (usually come from XHR calling)
    // and selected filter option (when we select or unselect filter option)
    // to return filtered items to parent component
    items() {
      this.$nextTick(() => {
        this.setFilteredItems(this.filteredItem)
      })
    },
    selectedFilter() {
      this.$nextTick(() => {
        this.setFilteredItems(this.filteredItem)
      })
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.setFilteredItems(this.filteredItem)
    })
  },
  methods: {
    // this method will be call whenever user change an option, say select or
    // unselect an option; it will just push new option to existed options, or
    // remove one
    handleChangeOption(event) {
      return (name, option, filterFunc) => {
        event.target.checked
          ? (this.selectedFilter[name] = { name, option, filterFunc })
          : delete this.selectedFilter[name]
        this.selectedFilter = { ...this.selectedFilter }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/_variables.scss';

.filter-panel {
  height: fit-content;
  width: 100%;
  padding: 10px 30px;
  min-height: fit-content;
}

.content {
  width: 100%;
}

.category {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
}

.category-title {
  font-size: 20px;
  margin-bottom: 5px;
}

.category-option-wrapper {
  margin-bottom: 3px;
}
</style>
