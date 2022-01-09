<template>
  <div class="container-fluid">
    <div class="breadcrumb-container">
      <Breadcrumb :name="originBeer.name" />
    </div>
    <div class="add-beer-container">
      <div class="left"><sidebar-admin /></div>
      <div class="right">
        <div class="right__top">
          <h5 class="subtitle">Thông tin bia</h5>
          <form id="needs-validation">
            <div class="notion-container">
              <p class="notion required-note">(*) Bắt buộc</p>
            </div>
            <div class="form-group info__content__name">
              <label for="">Tên bia <span class="required-note">*</span></label>

              <div class="input-box">
                <input
                  id="name"
                  v-model="newBeer.name"
                  type="text"
                  class="form-control"
                  disabled
                  required
                />
                <div class="invalid-feedback">
                  Tên bia không được bỏ trống !
                </div>
              </div>
            </div>
            <div class="form-group info__content__alcohol">
              <label for=""
                >Nồng độ cồn (%) <span class="required-note">*</span></label
              >

              <div class="input-box">
                <input
                  v-model="newBeer.alcohol_concentration"
                  type="number"
                  step="any"
                  class="form-control"
                  disabled
                  required
                />
                <div class="invalid-feedback">Vui lòng nhập nồng độ cồn !</div>
              </div>
            </div>
            <div class="form-group info__content__capacity">
              <label for=""
                >Dung tích <span class="required-note">*</span></label
              >

              <div class="input-box">
                <input
                  v-model="newBeer.capacity"
                  type="text"
                  class="form-control"
                  disabled
                  required
                />
                <div class="invalid-feedback">Vui lòng nhập dung tích !</div>
              </div>
            </div>
            <div class="form-group info__content__origin select-container">
              <label for="">Xuất xứ</label>
              <select
                v-if="originBeer.origin_nation"
                v-model="newBeer.origin_nation.id"
                class="form-select form-control"
                aria-label=""
                disabled
                required
              >
                <option
                  v-for="nation in nations"
                  :key="nation.id"
                  :value="nation.id"
                  :selected="originBeer.origin_nation.id == nation.id"
                >
                  {{ nation.name }}
                </option>
              </select>
              <select
                v-else
                v-model="newBeer.origin_nation.id"
                class="form-select form-control"
                aria-label=""
                disabled
              >
                <option
                  v-for="nation in nations"
                  :key="nation.id"
                  :value="nation.id"
                >
                  {{ nation.name }}
                </option>
              </select>
            </div>
            <div class="form-group info__content__price">
              <label for=""
                >Giá (VNĐ) <span class="required-note">*</span></label
              >

              <div class="input-box">
                <input
                  v-model="newBeer.price"
                  type="number"
                  class="form-control"
                  disabled
                  required
                />
                <div class="invalid-feedback">Vui lòng nhập giá tiền !</div>
              </div>
            </div>
            <div class="form-group info__content__unit">
              <label for=""
                >Đơn vị (thùng, hộp,...)
                <span class="required-note">*</span></label
              >

              <div class="input-box">
                <select
                  v-if="originBeer.beer_unit"
                  v-model="newBeer.beer_unit.id"
                  class="form-select form-control"
                  aria-label=""
                  disabled
                  required
                >
                  <option
                    v-for="unit in beerUnits"
                    :key="unit.id"
                    :value="unit.id"
                    :selected="originBeer.beer_unit.id == unit.id"
                  >
                    {{ unit.name }}
                  </option>
                </select>
                <select
                  v-else
                  v-model="newBeer.beer_unit.id"
                  class="form-select form-control"
                  aria-label=""
                  disabled
                  required
                >
                  <option
                    v-for="unit in beerUnits"
                    :key="unit.id"
                    :value="unit.id"
                  >
                    {{ unit.name }}
                  </option>
                </select>
                <div class="invalid-feedback">Vui lòng chọn đơn vị !</div>
              </div>
            </div>
            <div class="form-group info__content__bottle-amount">
              <label for=""
                >Số lượng trong mỗi đơn vị
                <span class="required-note">*</span></label
              >

              <div class="input-box">
                <input
                  v-model="newBeer.bottle_amount"
                  type="number"
                  class="form-control"
                  disabled
                  required
                />
                <div class="invalid-feedback">Vui lòng điền số lượng !</div>
              </div>
            </div>
            <div class="form-group info__content__description">
              <label for="">Mô tả</label>
              <textarea
                v-model="newBeer.description"
                rows="5"
                class="form-control"
                name="description"
                disabled
              ></textarea>
            </div>
            <div class="form-group info__content__producer">
              <label for=""
                >Nhà sản xuất <span class="required-note">*</span></label
              >
              <div class="input-box">
                <select
                  v-if="originBeer.producer"
                  v-model="newBeer.producer.id"
                  class="form-select form-control"
                  aria-label=""
                  disabled
                  required
                >
                  <option
                    v-for="producer in producers"
                    :key="producer.id"
                    :value="producer.id"
                    :selected="originBeer.producer.id == producer.id"
                  >
                    {{ producer.name }}
                  </option>
                </select>
                <select
                  v-else
                  v-model="newBeer.producer.id"
                  class="form-select form-control"
                  aria-label=""
                  disabled
                  required
                >
                  <option
                    v-for="producer in producers"
                    :key="producer.id"
                    :value="producer.id"
                  >
                    {{ producer.name }}
                  </option>
                </select>
                <div class="invalid-feedback">Vui lòng chọn nhà sản xuất !</div>
              </div>
            </div>

            <div v-if="!editting" class="action">
              <button
                class="btn btn-danger"
                @click="
                  (event) => {
                    event.preventDefault()
                    showConfirmModal = true
                  }
                "
              >
                Xóa
              </button>
              <button class="btn btn-primary" @click="changeState">
                Chỉnh sửa
              </button>
            </div>
            <div v-else class="action">
              <button class="btn btn-danger" @click="changeState">Hủy</button>
              <button class="btn btn-primary" @click="updateBeer">Lưu</button>
            </div>
          </form>
        </div>
        <div class="right__bottom">
          <h5 class="subtitle">Hình ảnh</h5>
          <div class="image-list">
            <div
              v-for="(photo, index) in originBeer.photos"
              :key="index"
              class="image-list__item"
            >
              <img :src="photo.link" alt="" class="image-list__item__image" />
            </div>
          </div>
          <div class="add-image">
            <div class="add-image__images">
              <label for="image" class="btn btn-secondary">Thêm ảnh</label>
              <input
                id="image"
                type="file"
                multiple
                accept="image/*"
                :hidden="true"
                @change="addImage"
              />
            </div>
            <div class="add-image__preview-image">
              <div v-for="imgUrl in imageUrls" :key="imgUrl">
                <img :src="imgUrl" alt="" class="image-item" />
              </div>
            </div>
            <div v-if="imageUrls.length > 0" class="action">
              <button class="btn btn-primary" @click="saveImage">
                Lưu ảnh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ConfirmModal
      v-show="showConfirmModal"
      @close-modal="showConfirmModal = false"
      @action-when-confirm="removeBeer"
    >
      <template #header>
        <h5>Xác nhận xóa bia</h5>
      </template>
      <template #body>
        <p>Bạn có chắc muốn xóa {{ originBeer.name }}</p>
      </template>
    </ConfirmModal>
  </div>
</template>

<script>
import Breadcrumb from '~/components/Breadcrumb.vue'
import SidebarAdmin from '~/components/SidebarAdmin.vue'
import ConfirmModal from '~/components/Modal/ConfirmModal.vue'
import { roleGuard } from '~/helper/helper'
export default {
  components: { Breadcrumb, SidebarAdmin, ConfirmModal },
  middleware: ['auth', roleGuard('admin')],
  data() {
    return {
      showConfirmModal: false,
      producers: [],
      beerUnits: [],
      nations: [],
      originBeer: {
        name: '',
      },
      newBeer: {
        name: null,
        alcohol_concentration: null,
        capacity: null,
        origin_nation: {
          id: null,
        },
        price: null,
        bottle_amount: null,
        describe: null,
        producer: {
          id: null,
        },
        beer_unit: {
          id: null,
        },
        photos: [],
      },
      editting: false,
      imageUrls: [],
      images: [],
    }
  },
  computed: {
    beerId() {
      return this.$router.currentRoute.params.id
    },
  },
  async created() {
    const PRODUCER_URL = '/beer/producer/get_all_with_name/'
    const BEER_UNIT_URL = '/beer/unit/'
    const NATION_URL = '/beer/nation/'
    const BEER_URL = '/beer/'

    if (process.client) {
      const authToken = localStorage.getItem('auth._token.local')
      try {
        const response = await this.$axios.get(`/api/v1${PRODUCER_URL}`, {
          headers: { Authorization: authToken },
        })
        this.producers = response.data

        const responseBeerUnit = await this.$axios.get(
          `/api/v1${BEER_UNIT_URL}`,
          {
            headers: { Authorization: authToken },
          }
        )
        this.beerUnits = responseBeerUnit.data.results

        const responseNation = await this.$axios.get(`/api/v1${NATION_URL}`, {
          headers: { Authorization: authToken },
        })
        this.nations = responseNation.data.results

        const responseBeer = await this.$axios.get(
          `/api/v1${BEER_URL}${this.beerId}`,
          {
            headers: { Authorization: authToken },
          }
        )
        this.originBeer = responseBeer.data
        Object.assign(this.newBeer, responseBeer.data)
        if (!this.newBeer.origin_nation) {
          this.newBeer.origin_nation = {
            id: null,
          }
        }
        if (!this.newBeer.beer_unit) {
          this.newBeer.beer_unit = {
            id: null,
          }
        }
        if (!this.newBeer.producer) {
          this.newBeer.producer = {
            id: null,
          }
        }
      } catch (err) {
        alert(err)
      }
    }
  },
  methods: {
    changeState(event) {
      event.preventDefault()
      this.editting = !this.editting
      if (!this.editting) {
        Object.assign(this.newBeer, this.originBeer)
      }
      const inputs = document.getElementsByClassName('form-control')
      const notes = document.getElementsByClassName('required-note')
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = !inputs[i].disabled
      }
      for (let i = 0; i < notes.length; i++) {
        notes[i].style.visibility =
          notes[i].style.visibility === 'visible' ? 'hidden' : 'visible'
      }
    },
    validate(event) {
      const form = document.getElementById('needs-validation')
      event.preventDefault()
      form.classList.add('was-validated')

      if (form.checkValidity() === false) {
        event.stopPropagation()
        return false
      }

      return true
    },
    async updateBeer(event) {
      const isValid = this.validate(event)
      if (isValid) {
        const URL = '/beer/'
        if (process.client) {
          const authToken = localStorage.getItem('auth._token.local')
          const newBeerInput = {
            ...this.newBeer,
            origin_nation: this.newBeer.origin_nation.id,
            producer: this.newBeer.producer.id,
            beer_unit: this.newBeer.beer_unit.id,
          }

          try {
            await this.$axios.patch(
              `/api/v1${URL}${this.beerId}/`,
              newBeerInput,
              {
                headers: { Authorization: authToken },
              }
            )
            this.$router.push('/dashboard/beers')
          } catch (err) {
            alert(err)
          }
        }
      }
    },
    async removeBeer(event) {
      const URL = '/beer/'
      if (process.client) {
        const authToken = localStorage.getItem('auth._token.local')
        try {
          await this.$axios.delete(`/api/v1${URL}${this.beerId}/`, {
            headers: { Authorization: authToken },
          })
          this.$router.push('/dashboard/beers')
        } catch (err) {
          alert(err)
        }
      }
    },
    async saveImage() {
      const URL = '/beer/'
      if (process.client) {
        const authToken = localStorage.getItem('auth._token.local')

        try {
          const formData = new FormData()

          for (const image of this.images) {
            formData.append('images', image)
          }

          await this.$axios.patch(`/api/v1${URL}${this.beerId}/`, formData, {
            headers: {
              Authorization: authToken,
              'Content-Type': 'multipart/form-data',
            },
          })

          await this.$axios.post(`/api/v1${URL}`, formData, {
            headers: {
              Authorization: authToken,
              'Content-Type': 'multipart/form-data',
            },
          })
          this.$router.push(`/dashboard/beers/${this.originBeer.id}`)
        } catch (err) {
          alert(err)
        }
      }
    },
    addImage(event) {
      const imageFile = document.querySelector('#image')
      const images = Array.from(imageFile.files)

      for (const image of images) {
        if (!this.images.includes(image)) {
          this.images.push(image)
        }
      }
      this.previewImage(event)
    },
    previewImage(event) {
      const images = event.target.files
      if (images) {
        const imageAmount = images.length

        for (let i = 0; i < imageAmount; i++) {
          const reader = new FileReader()
          reader.onload = () => {
            this.imageUrls.push(reader.result)
          }
          reader.readAsDataURL(images[i])
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';

.container-fluid {
  /* padding: 150px 0 0 0; */
}
.add-beer-container {
  display: flex;
  flex-direction: row;
  .left {
    width: 300px;
  }
  .right {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    margin-bottom: 40px;

    &__top,
    &__bottom {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 30px;
      padding-left: 20px;
      padding-right: 20px;
      background-color: $hoverSidebar;
      padding-top: 20px;
      border-radius: 10px;
      width: 100%;
    }

    .subtitle {
      width: 100%;
      text-align: left;
      padding-left: 5%;
      font-weight: 500;
      color: $black;
    }

    .notion-container {
      display: flex;
      width: 100%;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .notion {
      width: 100%;
      text-align: left;
    }
    .required-note {
      color: red;
      visibility: hidden;
    }
  }
}
.form-control {
  box-shadow: none;
}
.form-group {
  display: flex;
  flex-direction: row;

  label {
    width: 200px;
  }
  .form-select,
  input,
  textarea {
    width: 400px;
  }
}
.image-list {
  display: flex;
  flex-direction: column;
  &__item {
    display: flex;
    justify-content: center;
    margin: 20px 10px;

    &__image {
      width: 50%;
    }
  }
}
.btn {
  width: 100px;
  margin-bottom: 30px;
}

.add-image {
  width: 100%;
  &__preview-image {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 0px 20px 50px 20px;
    background-color: $white;
    border-radius: 10px;
  }
  .image-item {
    width: 200px;
    display: inline-block;
    margin: 10px;
  }
}
</style>
