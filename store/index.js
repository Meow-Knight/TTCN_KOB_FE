export const state = () => ({
  loadingState: false,
})

export const mutations = {
  setLoadingState(state, loadingState) {
    state.loadingState = loadingState
  },
}
