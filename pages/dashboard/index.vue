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
      <div class="staff-dashboard mt-5">
        <BarChart
          :data="barChartData"
          :options="barChartOptions"
          :height="100"
        />
      </div>
      <div class="dashboard-item top-products">
        <label for="">Sản phẩm bán chạy</label>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Sản phẩm</th>
              <th scope="col">Đã bán</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(product, index) in topProducts"
              :key="product.id"
              class="user-list__item"
            >
              <th scope="row">{{ index + 1 }}</th>
              <td>
                <img :src="product.photo" height="40px" width="60px" alt="" />
                {{ product.name }}
              </td>
              <td>{{ product.total_sum }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import LineChart from '~/components/Chart/LineChart.vue'
import BarChart from '~/components/Chart/Barchart.vue'
import Breadcrumb from '~/components/Breadcrumb.vue'

export default {
  components: { Breadcrumb, LineChart, BarChart },
  layout: 'admin',
  data() {
    return {
      duration: 'month',
      type: 'sale',
      lineChartLabels: [],
      barChartLabels: [],
      dataLineChart: [],
      dataBarChart: [],
      topProducts: [],
      sales: 0,
      amount: 0,
    }
  },
  computed: {
    lineChartData() {
      return {
        labels: this.lineChartLabels,
        datasets: [
          {
            label: this.type === 'sale' ? 'Doanh thu' : 'Doanh số',
            data: this.dataLineChart,
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
            this.duration === 'week'
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
              scaleLabel: {
                display: true,
                labelString: this.type === 'sale' ? 'VND' : 'Đơn',
              },
            },
          ],
        },
      }
    },
    barChartData() {
      return {
        labels: this.barChartLabels,
        datasets: [
          {
            label: 'Doanh số',
            data: this.dataBarChart,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
          },
        ],
      }
    },
    barChartOptions() {
      return {
        responsive: true,
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Thống kê nhân viên',
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
              scaleLabel: {
                display: true,
                labelString: 'Đơn',
              },
            },
          ],
        },
      }
    },
  },
  created() {
    this.getLineChartData()
    this.getBarChartData()
    this.getTopProducts()
  },
  methods: {
    changeType(newType) {
      this.type = newType
      this.getLineChartData()
    },
    changeDuration(newDuration) {
      this.duration = newDuration
      this.getLineChartData()
    },
    async getLineChartData() {
      const URL = '/beer/chart_data/'
      this.$store.commit('setLoadingState', true)

      if (process.client) {
        const authToken = this.$auth.strategy.token.get()
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
          this.lineChartLabels = labels
          this.dataLineChart = dataChart
        } catch (err) {
          alert(err)
        }
      }
      this.$store.commit('setLoadingState', false)
    },
    async getBarChartData() {
      const URL = `/account/staffs/?page=1&page_size=1000`
      this.$store.commit('setLoadingState', true)

      if (process.client) {
        const authToken = this.$auth.strategy.token.get()
        try {
          const response = await this.$axios.get(`/api/v1${URL}`, {
            headers: { Authorization: authToken },
          })
          const labels = []
          const dataChart = []
          for (const staff of response.data.results) {
            labels.push(staff.username)
            dataChart.push(staff.total_confirmed)
          }
          this.barChartLabels = labels
          this.dataBarChart = dataChart
        } catch (err) {
          alert(err)
        }
      }
      this.$store.commit('setLoadingState', false)
    },
    async getTopProducts() {
      this.$store.commit('setLoadingState', true)
      const URL = '/beer/top/'

      if (process.client) {
        const authToken = this.$auth.strategy.token.get()
        try {
          const response = await this.$axios.get(`/api/v1${URL}`, {
            headers: { Authorization: authToken },
          })
          this.topProducts = response.data
        } catch (err) {
          alert(err)
        }
      }
      this.$store.commit('setLoadingState', false)
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~assets/scss/variables';

.dashboard-item {
  margin-top: 20px;
}
.sum {
  display: flex;
  flex-direction: row;
  &__item {
    text-align: center;
    margin-left: 20px;
    background-color: $hoverSidebar;
    padding: 10px;
    border-radius: 10px;
  }
  &__sales {
  }
}
.nav-item {
  cursor: pointer;
  .active {
    color: seagreen;
  }
}
</style>
