export default {
  // set a new cart data (after fetching cart data from API)
  setCartData(state, cartItems) {
    state.items = cartItems
  },
  setLoadingState(state, loadingState) {
    state.loadingState = loadingState
  },
}
