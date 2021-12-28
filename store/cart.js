export const state = () => ({
  items: [],
})

// mutation for store
export const mutations = {
  // set a new cart data (after fetching cart data from API)
  setCart(state, cart) {
    state.cart.items = cart
  },
  // change cart data after actions like add items to or remove items from cart
  // this is an option, maybe we can leave this process to BE and just receive
  // cart data after processing
  changeCartAfterMutate(state, { item, amount, action }) {
    let index
    switch (action) {
      case 'add':
        index = state.items.findIndex(({ id }) => id === item.id)
        if (index >= 0) {
          return (state.items[index].amount += amount)
        }
        state.items.push({ ...item, amount })
        return
      case 'remove':
        state.items = state.items.filter(({ id }) => id === item.id)
        return
      case 'changeNumber':
        state.items = state.items.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, amount: cartItem.amount + amount }
            : { ...cartItem }
        )
        return
      default:
        throw new Error('fuck')
    }
  },
}
