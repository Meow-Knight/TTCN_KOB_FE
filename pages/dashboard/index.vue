<template>
  <div class="container-fluid">
    <div class="breadcrumb-container">
      <Breadcrumb />
    </div>
    <div class="users-container">
      <LineChart :data="lineChartData" :height="200" />
    </div>
  </div>
</template>
<script>
import LineChart from '~/components/Chart/LineChart.vue'
import Breadcrumb from '~/components/Breadcrumb.vue'

export default {
  components: { Breadcrumb, LineChart },
  layout: 'admin',
  data() {
    return {
      duration: 'month',
      type: 'sale',
      lineChartData: {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        datasets: [
          {
            label: 'My First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      },
    }
  },
  async created() {
    const URL = '/beer/chart_data/'
    if (process.client) {
      const authToken = localStorage.getItem('auth._token.local')
      try {
        const response = await this.$axios.get(
          `/api/v1${URL}?duration=${this.duration}&type=${this.type}`,
          {
            headers: { Authorization: authToken },
          }
        )
        console.log(response.data)
      } catch (err) {
        alert(err)
      }
    }
  },
}
</script>
