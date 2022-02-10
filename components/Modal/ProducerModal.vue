<template>
  <transition name="modal">
    <div class="modal-mask" @click="$emit('close-modal')">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <slot name="header"> Thêm nhà sản xuất bia </slot>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label for="inputAddress">Nhập Tên Nhà Máy</label>
            <input
              v-model="name"
              type="text"
              class="form-control"
              placeholder="Nhà Máy Bia "
              required
            />
            <br/>
            <label for="inputAddress">Địa Chỉ</label>
            <input
              v-model="address"
              type="text"
              class="form-control"
              placeholder="83 Nguyễn Công Trứ, Hải Châu, Đà Nẵng, Việt Nam"
              required
            />
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-primary" @click="createProducer()">Add</button>
          <button class="btn btn-danger" @click="$emit('close-modal')">
            Close
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      name: '',
      address: '',
    }
  },
  methods: {
    async createProducer() {
      try {
        const producer = {
          company_name: this.name,
          address: this.address,
        }
        const authToken = this.$auth.strategy.token.get()
        const URL = '/beer/producer/'
        const response = await axios.post(`/api/v1${URL}`, producer, {
          headers: {"Authorization" : authToken}
        });
        console.log(response);
        this.$toast.success('YE! You did it!')
        location.reload()
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.error('Create failed! Plz check your producer name')
        }
      }
    },
  },
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  width: 600px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.selected-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
