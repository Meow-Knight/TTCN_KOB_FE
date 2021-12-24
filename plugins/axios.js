export default function ({ $axios, isServer, __isRetryRequest, store, app, redirect , payload , next}) {
  $axios.onRequest(config => {
    console.log('Making request to ' + config.url);
  })

  $axios.onResponseError(async err => {
    const code = parseInt(err.response && err.response.status);

    const originalRequest = err.config;
    if (originalRequest.__isRetryRequest) {
      return;
    }

    if (code === 401) {
      console.log("code", code);
      originalRequest.__isRetryRequest = true;
      const token = app.$auth.strategy.refreshToken.get();

      try { 
        const response = await $axios.post(`http://localhost:8000/token/refresh`, { refresh: token });
        if (response.status === 200) {
          app.$auth.strategy.refreshToken.set(response.data.refresh);
          app.$auth.strategy.token.set(response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        }
        return $axios(originalRequest);
      } catch (e) {
        console.log("Error, redirect to login");
        app.router.push('/login');
      }
    }
  });
}