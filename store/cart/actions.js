const baseURL = '/api/v1/beer/cart'

export default {
  /**
   * async action to add new item to cart
   * @param {*} beer: id of beer to add
   * @param {*} amount: amount to add
   */
  async addNewItem({ dispatch }, { beer, amount }) {
    try {
      await this.$axios.post(baseURL, {
        beer,
        amount,
      })
      dispatch('getCartData')
    } catch (err) {
      console.log(err.response || err)
    }
  },
  /**
   * async action to add new item and go to cart detail page
   * @param {*} beer: id of beer to add
   * @param {*} amount: amount to add
   */
  async addNewItemAndBuy({ dispatch }, { beer, amount }) {
    try {
      await dispatch('addNewItem', { beer, amount })
      await dispatch('getCartData')
      this.$router.push('/user/cart')
    } catch (err) {
      console.log(err.response || err)
    }
  },
  /**
   * async action to update item
   * @param {*} recordId: id of order record to be updated
   * @param {*} beer: id of item to be updated
   * @param {*} amount: new amount
   */
  async updateItem({ dispatch }, { recordId, beer, amount }) {
    try {
      if (amount === 0) {
        dispatch('removeItem', { recordId })
        return
      }
      await this.$axios.patch(baseURL + '/' + recordId, {
        beer,
        amount,
      })
      dispatch('getCartData')
    } catch (err) {
      console.log(err.response || err)
    }
  },
  /**
   * async action to remove order record from cart
   * @param {*} recordId: id of the record to be removed
   */
  async removeItem({ dispatch }, { recordId }) {
    try {
      await this.$axios.delete(baseURL + '/' + recordId)
      dispatch('getCartData')
    } catch (err) {
      console.log(err.response || err)
    }
  },
  /**
   * async action to fetch cart data
   */
  async getCartData({ commit }) {
    try {
      const { data } = await this.$axios.get(baseURL)
      commit('setLoadingState', false)
      commit('setCartData', data)
    } catch (err) {
      commit('setLoadingState', false)
      console.log(err.response || err)
    }
  },
}
