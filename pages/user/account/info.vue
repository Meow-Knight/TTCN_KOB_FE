<template>
  <div class="info">
    <div class="header">HỒ SƠ CỦA TÔI</div>
    <div class="inner-container">
      <div class="left">
        <form class="info-form">
          <div class="form-control">
            <label for="email" class="label"> Địa chỉ email </label>
            <div class="input">
              {{ user.email || 'longvavet1325@gmail.com' }}
            </div>
          </div>
          <div class="form-control">
            <label for="name" class="label"> Họ và tên </label>
            <input
              ref="name"
              class="input edit"
              :value="user.name || 'Trần Ngọc Long'"
            />
          </div>
          <div class="form-control">
            <label for="phone" class="label"> Số điện thoại </label>
            <input class="input edit" :value="user.phone || '0974754560'" />
          </div>
          <div class="form-control">
            <label for="birthday" class="label"> Ngày sinh </label>
            <div class="input birthday">
              <user-page-dropdown
                :options="dayOfMonth"
                :selected-option="selectedDate.day"
                :set-selected-option="setSelectedDate('day')"
              ></user-page-dropdown>
              <user-page-dropdown
                :options="monthOfYear"
                :selected-option="selectedDate.month"
                :set-selected-option="setSelectedDate('month')"
              ></user-page-dropdown>
              <user-page-dropdown
                :options="year"
                :selected-option="selectedDate.year"
                :set-selected-option="setSelectedDate('year')"
              ></user-page-dropdown>
            </div>
          </div>
          <button class="submit-button" type="submit">Lưu</button>
        </form>
      </div>
      <div class="right">
        <div class="right-avatar-wrapper">
          <img class="right-avatar" :src="require('~/assets/img/logo3.png')" />
        </div>
        <input
          type="file"
          accept=".png, .jpeg, .jpg"
          class="input-change-avatar"
          @change="handleChangeAvatar($event)"
        />
        <button class="change-avatar-button" @click.prevent="uploadFile">
          Đổi ảnh đại diện
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import UserPageDropdown from '~/components/UserPageDropdown.vue'
export default {
  components: { UserPageDropdown },
  layout: 'user',
  data() {
    return {
      selectedDate: {
        day: 30,
        month: 'Tháng 10',
        year: 2000,
      },
      selectedAvatar: null,
      name: '',
      phone: '',
    }
  },
  computed: {
    dayOfMonth() {
      return Array(31)
        .fill(null)
        .map((val, index) => index + 1)
    },
    monthOfYear() {
      return Array(12)
        .fill(null)
        .map((val, index) => 'Tháng ' + (index + 1))
    },
    year() {
      return Array(100)
        .fill(null)
        .map((val, index) => new Date().getFullYear() - index)
    },
    user() {
      return this.$auth.user
    },
    acceptAvatarMIMEType() {
      return ['image/png', 'image/jpeg']
    },
    limitAvatarSize() {
      return 1024 * 1024 * 2
    },
  },
  methods: {
    setSelectedDate(type) {
      return (newVal) => {
        this.selectedDate = {
          ...this.selectedDate,
          [type]: newVal,
        }
      }
    },
    uploadFile() {
      const fileInput = document.querySelector('.input-change-avatar')
      fileInput.click()
    },
    handleChangeAvatar(event) {
      const file = event.target.files[0]
      if (!this.acceptAvatarMIMEType.includes(file.type))
        return alert('Vui lòng chọn file ảnh hợp lệ')
      if (file.size > this.limitAvatarSize)
        return alert('Vui lòng chọn file ảnh không quá 2 MB')
      this.selectedAvatar = file
    },
    handleFormSubmit() {},
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';

.info {
  width: 100%;
  max-width: none;
  height: 120%;
  min-height: 70vh;
  padding: 20px 25px;
  background: $white;
}

.header {
  margin: auto 0;
  font-size: 25px;
  font-weight: 500;
  padding: 15px 0px;
  border-bottom: 1px solid rgb(230, 219, 219);
  height: 80px;
}

.inner-container {
  padding-top: 40px;
  display: flex;
}

.left {
  width: 60%;
}

.info-form {
  width: 100%;
}

.form-control {
  padding: 0 0 40px 0;
  height: fit-content;
  display: flex;
  align-items: center;
  width: 100%;
  border: none;
}

.label {
  width: 25%;
  display: block;
  text-align: right;
  padding: 3px 0;
  height: fit-content;
  margin: 0;
}

.input {
  width: 70%;
  margin-left: 5%;
  padding: 3px 0;
  height: fit-content;
}

.input.edit {
  border: 1px solid rgba(0, 0, 0, 0.14);
  padding: 5px 10px;
  box-shadow: inset 0 2px 0 0 rgb(0 0 0 / 2%);
  border-radius: 3px;
}

.input.edit:focus {
  outline: 1px solid $red;
}

.birthday {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.submit-button {
  margin-left: 30%;
  width: 100px;
}

.right {
  width: 40%;
  padding: 0 10%;
  margin-top: -40px;
}

.right-avatar-wrapper {
  width: 100%;
  padding-bottom: 100%;
  position: relative;
}

.right-avatar {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.input-change-avatar {
  display: none;
}

.change-avatar-button {
  display: block;
  margin: 0 auto;
  width: fit-content;
}

button {
  border: none;
  background: rgb(216, 211, 211);
  color: $black;
  padding: 10px 15px;
  border-radius: 5px;
  transition: 0.3s ease-in-out;
}

button:hover {
  background: $red;
  color: $white2;
  transition: 0.3s ease-in-out;
}
</style>
