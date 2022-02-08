<template>
  <div class="container-fluid">
    <div class="breadcrumb-container">
      <Breadcrumb />
    </div>
    <div class="dashboard-container">
      <div class="dashboard-item sale">
        <div class="chart-controller">
          <ul class="nav nav-tabs">
            <li class="nav-item" @click="changeType('sale')">
              <span :class="type == 'sale' ? 'nav-link active' : 'nav-link'"
                >Doanh thu</span
              >
            </li>
            <li class="nav-item" @click="changeType('amount')">
              <span :class="type == 'amount' ? 'nav-link active' : 'nav-link'"
                >Doanh số</span
              >
            </li>
          </ul>
          <ul class="mx-5 mt-3 nav nav-tabs">
            <li class="nav-item" @click="changeDuration('day')">
              <span :class="duration == 'day' ? 'nav-link active' : 'nav-link'"
                >Ngày</span
              >
            </li>
            <li class="nav-item" @click="changeDuration('week')">
              <span :class="duration == 'week' ? 'nav-link active' : 'nav-link'"
                >Tuần</span
              >
            </li>
            <li class="nav-item" @click="changeDuration('month')">
              <span
                :class="duration == 'month' ? 'nav-link active' : 'nav-link'"
                >Tháng</span
              >
            </li>
            <li class="nav-item" @click="changeDuration('year')">
              <span :class="duration == 'year' ? 'nav-link active' : 'nav-link'"
                >Năm</span
              >
            </li>
          </ul>
        </div>
        <LineChart
          :data="lineChartData"
          :options="lineChartOptions"
          :height="100"
        />
      </div>
      <div class="dashboard-item top-products">
        <label for="">Sản phẩm bán chạy</label>
      </div>
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
      labels: [],
      dataChart: [],
    }
  },
  computed: {
    lineChartData() {
      return {
        labels: this.labels,
        datasets: [
          {
            label: this.type === 'sale' ? 'Doanh thu' : 'Doanh số',
            data: this.dataChart,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      }
    },
    lineChartOptions() {
      return {
        responsive: true,
        fill: false,
        legend: {
          display: false,
        },
        title: {
          display: true,
          text:
            this.duration === 'day'
              ? 'Ngày qua'
              : this.duration === 'week'
              ? 'Tuần qua'
              : this.duration === 'month'
              ? 'Tháng qua'
              : 'Năm qua',
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      }
    },
  },
  created() {
    this.getChartData()
  },
  methods: {
    changeType(newType) {
      this.type = newType
      this.getChartData()
    },
    changeDuration(newDuration) {
      this.duration = newDuration
      this.getChartData()
    },
    async getChartData() {
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
          const labels = []
          const dataChart = []
          for (const key in response.data) {
            labels.push(key)
            dataChart.push(response.data[key])
          }
          this.labels = labels
          this.dataChart = dataChart
        } catch (err) {
          alert(err)
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.dashboard-item {
  margin-top: 20px;
}
.nav-item {
  cursor: pointer;
  .active {
    color: seagreen;
  }
}
</style>
