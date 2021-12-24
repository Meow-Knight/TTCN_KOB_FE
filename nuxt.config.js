export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "TTCN_KOB_FE",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Roboto:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100&display=swap",
      },
      { rel: "icon", type: "image/x-icon", href: "/beer.png" },
      {
        rel: "stylesheet",
        href: "https://use.fontawesome.com/releases/v5.2.0/css/all.css",
      },
      {
        rel: "illu animation",
        href: "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js",
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["~/assets/scss/_variables.scss"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/axios'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    "@nuxtjs/eslint-module",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    "bootstrap-vue/nuxt",
    "@nuxtjs/axios",
    "@nuxtjs/auth-next",
    "@nuxtjs/proxy",
    "@nuxtjs/toast",
  ],

  toast: {
    position: "top-right",
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  auth: {
    strategies: {
      google: {
        clientId:
          "998587115630-ubo22cf69riu891huoch6c0nbckm10h0.apps.googleusercontent.com",
        codeChallengeMethod: "",
        responseType: "code",
        refreshToken: {
          property: "refresh_token",
          data: "refresh_token",
          maxAge: 60 * 60 * 24 * 30
        },
        endpoints: {
          token: "http://localhost:8000/login/",
          userInfo: "http://localhost:8000/api/v1/account/info",
          // logout: { url: '/auth/user/logout', method: 'delete' },
        },
      },
    },
  },

  proxy: {
    "/api/v1": {
      target: "http://localhost:8000/api/v1",
      pathRewrite: { "^/api/v1": "" },
      changeOrigin: true,
    },
  },
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:8000/api/v1",
        ws: true,
        changeOrigin: true,
      },
    },
  },
};
