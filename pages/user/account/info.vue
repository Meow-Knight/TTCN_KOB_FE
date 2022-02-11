<template>
  <div class="info">
    <div class="header">HỒ SƠ CỦA TÔI</div>
    <div class="inner-container">
      <div class="left">
        <form class="info-form" @submit.prevent="handleFormSubmit($event)">
          <div class="form-control">
            <label for="email" class="label"> Email </label>
            <div class="input">
              {{ user.email || '' }}
            </div>
          </div>
          <!-- <div class="form-control">
            <label for="birthday" class="label"> Ngày sinh </label>
            <div class="input birthday">
              <user-page-dropdown
                :options="dayOfMonth"
                :selected-option="selectedDate.day || 'Ngày'"
                :set-selected-option="setSelectedDate('day')"
              ></user-page-dropdown>
              <user-page-dropdown
                :options="monthOfYear"
                :selected-option="selectedDate.month || 'Tháng'"
                :set-selected-option="setSelectedDate('month')"
              ></user-page-dropdown>
              <user-page-dropdown
                :options="year"
                :selected-option="selectedDate.year || 'Năm'"
                :set-selected-option="setSelectedDate('year')"
              ></user-page-dropdown>
            </div>
          </div> -->
          <!-- <div class="form-control">
            <label for="address" class="label"> Địa chỉ </label>
            <div class="input address">
              <user-page-dropdown
                :options="provinceOptions"
                :selected-option="selectedAddress.province || 'Tỉnh'"
                :set-selected-option="setSelectedAddress('province')"
              ></user-page-dropdown>
              <user-page-dropdown
                :options="districtOptions"
                :selected-option="selectedAddress.district || 'Huyện'"
                :set-selected-option="setSelectedAddress('district')"
              ></user-page-dropdown>
              <user-page-dropdown
                :options="wardOptions"
                :selected-option="selectedAddress.ward || 'Xã'"
                :set-selected-option="setSelectedAddress('ward')"
              ></user-page-dropdown>
            </div>
          </div> -->
          <div class="form-control">
            <label for="last_name" class="label"> Họ </label>
            <input
              v-model.trim="userInfo.last_name"
              class="input edit"
              name="last_name"
            />
          </div>
          <div class="form-control">
            <label for="first_name" class="label"> Tên </label>
            <input
              v-model.trim="userInfo.first_name"
              class="input edit"
              name="first_name"
            />
          </div>
          <div class="form-control">
            <label for="phone" class="label"> Điện thoại </label>
            <input
              v-model.trim="userInfo.phone"
              class="input edit"
              name="phone"
            />
          </div>
          <div class="form-control">
            <label for="detail-address" class="label">
              Địa chỉ chi tiết:
            </label>
            <input
              v-model.trim="userInfo.address"
              class="input edit"
              name="address"
            />
          </div>
          <input type="file" value="" class="hidden-file" hidden />
          <button class="submit-button" type="submit">Lưu</button>
        </form>
      </div>
      <div class="right">
        <div class="right-avatar-wrapper">
          <img
            class="right-avatar"
            :src="$auth.user.avatar || require('~/assets/img/logo3.png')"
          />
        </div>
        <input
          type="file"
          accept=".png, .jpeg, .jpg"
          class="input-change-avatar"
          @input="handleChangeAvatar($event)"
        />
        <button class="change-avatar-button" @click.prevent="uploadFile">
          Đổi ảnh đại diện
        </button>
        <div class="change-avatar-note">
          File ảnh không quá 2MB, định dạng JPG, JPEG, PNG
        </div>
        <base-dialog
          v-if="notification.title"
          :title="notification.title"
          @close="confirmNotification"
        >
          <template #default>
            <h3>
              {{ notification.message }}
            </h3>
          </template>
        </base-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import BaseDialog from '~/components/Modal/BaseDialog.vue'
export default {
  components: { BaseDialog },
  layout: 'user',
  data() {
    return {
      user: null,
      selectedAvatar: null,
      userInfo: {
        first_name: '',
        last_name: '',
        phone: '',
        address: '',
        avatar: null,
      },
      notification: {
        title: null,
        message: null,
      },
    }
  },
  computed: {
    editPath() {
      return '/api/v1/account/edit'
    },
    acceptAvatarMIMEType() {
      return ['image/png', 'image/jpeg']
    },
    limitAvatarSize() {
      return 1024 * 1024 * 2
    },
  },
  watch: {
    user() {
      this.userInfo = {
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        phone: this.user.phone,
        address: this.user.address,
        avatar: this.user.avatar,
      }
    },
    selectedAvatar(cur, prev) {
      const fr = new FileReader()
      const avatarDisplay = document.querySelector('.right-avatar')
      avatarDisplay.title = cur.name
      fr.onload = (e) => {
        avatarDisplay.src = e.target.result
      }
      fr.readAsDataURL(cur)
    },
  },
  created() {
    this.user = this.$auth.user
  },
  methods: {
    // handle event when user click on change avatar button
    uploadFile() {
      const fileInput = document.querySelector('.input-change-avatar')
      fileInput.click()
    },
    handleChangeAvatar(event) {
      const file = event.target.files[0]
      // in case the image file is invalid, show notification and flush input value
      if (!this.acceptAvatarMIMEType.includes(file.type)) {
        event.target.value = ''
        return (this.notification = {
          ...this.notification,
          title: 'Lỗi định dạng',
          message: 'Định dạng file phải là JPG, JPEG hoặc PNG',
        })
      }
      if (file.size > this.limitAvatarSize) {
        event.target.value = ''
        return (this.notification = {
          ...this.notification,
          title: 'Lỗi file',
          message: 'File ảnh có độ lớn không quá 2MB',
        })
      }
      this.selectedAvatar = file
    },
    confirmNotification() {
      this.notification = {
        ...this.notification,
        title: null,
        message: null,
      }
    },
    isValidPhoneNumber(phone) {
      return /(([03+[2-9]|05+[6|8|9]|07+[0|6|7|8|9]|08+[1-9]|09+[1-4|6-9]]){3})+[0-9]{7}\b/g.test(
        phone
      )
    },
    async handleFormSubmit(event) {
      try {
        if (
          !(
            this.userInfo.first_name &&
            this.userInfo.last_name &&
            this.userInfo.phone &&
            this.userInfo.address
          )
        )
          return (this.notification = {
            title: 'Dữ liệu không hợp lệ',
            message: 'Bạn không được để trống các trường dữ liệu',
          })
        if (!this.isValidPhoneNumber(this.userInfo.phone))
          return (this.notification = {
            title: 'Dữ liệu không hợp lệ',
            message: 'Số điện thoại không hợp lệ',
          })
        const formData = new FormData(event.target)
        if (this.selectedAvatar) formData.append('avatar', this.selectedAvatar)
        await this.$axios.patch(this.editPath, formData)
        const response = await this.$axios.get('/api/v1/account/info')
        this.$auth.setUser(response.data)
        this.notification = {
          title: 'Thành công',
          message: 'Lưu dữ liệu thành công',
        }
      } catch (err) {
        console.log(err.response || err)
      }
      // we will need to validate data here and show notification if anything went wrong
      // this.$auth.setUser()
    },
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
  width: 70%;
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
  text-align: left;
  padding: 3px 0 3px 10%;
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

.address {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.submit-button {
  width: 100px;
  display: block;
  margin: auto;
}

.right {
  width: 30%;
  padding: 0 5%;
  margin-top: -40px;
}

.right-avatar-wrapper {
  width: 50%;
  padding-bottom: 50%;
  position: relative;
  margin: 20px auto;
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

.change-avatar-note {
  font-style: italic;
  text-align: center;
  margin-top: 20px;
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
