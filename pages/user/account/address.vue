<template>
  <div class="address-container">
    <div class="header">
      <div class="header-text">ĐỊA CHỈ CỦA TÔI</div>
      <button class="add-address-button">
        <svg
          enable-background="new 0 0 10 10"
          viewBox="0 0 10 10"
          x="0"
          y="0"
          height="15px"
          width="15px"
          fill="currentColor"
          class="icon-plus-sign"
        >
          <polygon
            points="10 4.5 5.5 4.5 5.5 0 4.5 0 4.5 4.5 0 4.5 0 5.5 4.5 5.5 4.5 10 5.5 10 5.5 5.5 10 5.5"
          ></polygon>
        </svg>
        <div class="button-text">Thêm địa chỉ mới</div>
      </button>
    </div>
    <div v-if="!allAddress.length" class="no-address">
      Bạn chưa có địa chỉ giao hàng.
    </div>
    <div v-else class="address-content">
      <div
        v-for="(address, index) in allAddress"
        :key="address.detailAddress"
        class="address-card-container"
        :class="{
          default: address.isDefault,
          last: index === allAddress.length - 1,
        }"
      >
        <div class="card-content">
          <div class="card-row">
            <div class="row-name">Họ và tên</div>
            <div class="row-content name">
              {{ address.name }}
            </div>
          </div>
          <div class="card-row">
            <div class="row-name">Số điện thoại</div>
            <div class="row-content">{{ address.phone }}</div>
          </div>
          <div class="card-row">
            <div class="row-name">Địa chỉ</div>
            <div class="row-content">
              {{ address.detailAddress }} <br />
              {{ address.province }} <br />
              {{ address.district }} <br />
              {{ address.village }} <br />
            </div>
          </div>
        </div>
        <div class="card-action">
          <div class="modify-action">
            <button class="update-button">Sửa</button>
            <button v-if="!address.isDefault" class="delete-button">Xóa</button>
          </div>
          <div class="set-default">
            <button class="set-default-button">Đặt làm mặc định</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'user',
  data() {
    return {
      allAddress: [
        {
          name: 'Trần Ngọc Long',
          phone: '0974754560',
          detailAddress:
            '461 Nguyễn Lương Bằng, Hòa Khánh Bắc, Liên Chiểu, Đà Nẵng',
          province: 'Đà Nẵng',
          district: 'Liên Chiểu',
          village: 'Hòa Khánh Bắc',
          isDefault: true,
        },
        {
          name: 'Trần Ngọc Long',
          phone: '0974754560',
          detailAddress:
            '461 Nguyễn Lương Bằng, Hòa Khánh Bắc, Liên Chiểu, Đà Nẵng',
          province: 'Đà Nẵng',
          district: 'Liên Chiểu',
          village: 'Hòa Khánh Bắc',
          isDefault: false,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';

.address-container {
  width: 100%;
  max-width: none;
  height: 80%;
  min-height: 70vh;
  padding: 20px 25px;
  background: $white;
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 15px 0px;
  border-bottom: 1px solid rgb(230, 219, 219);
  height: 80px;
}

.header-text {
  font-size: 25px;
  font-weight: 500;
}

.add-address-button {
  display: flex;
  align-items: center;
  width: 200px;
  justify-content: space-around;
}

.no-address {
  margin: 30px auto;
  font-size: 25px;
  width: fit-content;
}

.address-card-container {
  padding: 40px 0 40px 30px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.14);
  display: flex;
  justify-content: space-between;
}

.address-card-container.last {
  border: none;
}

.card-content {
  width: 70%;
}

.card-row {
  display: flex;
}

.row-name {
  width: 20%;
  text-align: right;
  margin-bottom: 10px;
}

.row-content {
  width: fit-content;
  padding: 0 20px 0 10%;
  position: relative;
}

.modify-action {
  margin-bottom: 20px;
  text-align: right;
}

.delete-button {
  background: $red;
  color: $white;
}

.address-card-container.default {
  .row-content.name::after {
    content: 'Mặc định';
    position: absolute;
    top: 10%;
    left: 100%;
    width: fit-content;
    height: 80%;
    padding: 0 5px;
    display: flex;
    align-items: center;
    color: $white;
    background: $red;
    border-radius: 5px;
  }

  .delete-button {
    display: none;
  }

  .set-default-button {
    pointer-events: none;
    opacity: 0.5;
  }
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
