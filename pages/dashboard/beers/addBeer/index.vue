<template>
  <div class="container-fluid">
    <div class="breadcrumb-container">
      <Breadcrumb />
    </div>
    <div class="add-beer-container">
      <div class="right">
        <form id="needs-validation">
          <p class="notion required-note">(*) Bắt buộc</p>
          <div class="form-group info__content__name">
            <label for="">Tên bia <span class="required-note">*</span>:</label>
            <div class="input-box">
              <input
                id="name"
                v-model="newBeer.name"
                type="text"
                class="form-control"
                required
              />
              <div class="invalid-feedback">Tên bia không được bỏ trống !</div>
            </div>
          </div>
          <div class="form-group info__content__alcohol">
            <label for=""
              >Nồng độ cồn (%) <span class="required-note">*</span>:</label
            >
            <div class="input-box">
              <input
                v-model="newBeer.alcohol_concentration"
                type="number"
                step="any"
                class="form-control"
                required
              />
              <div class="invalid-feedback">Vui lòng nhập nồng độ cồn !</div>
            </div>
          </div>
          <div class="form-group info__content__capacity">
            <label for=""
              >Dung tích (ml) <span class="required-note">*</span>:</label
            >
            <div class="input-box">
              <input
                v-model="newBeer.capacity"
                type="number"
                class="form-control"
                required
              />
              <div class="invalid-feedback">Vui lòng nhập dung tích !</div>
            </div>
          </div>
          <div class="form-group info__content__origin select-container">
            <label for="">Xuất xứ:</label>
            <select
              v-model="newBeer.origin_nation"
              class="form-select form-control"
              aria-label=""
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
              >Giá (VNĐ) <span class="required-note">*</span>:</label
            >
            <div class="input-box">
              <input
                v-model="newBeer.price"
                type="number"
                class="form-control"
                required
              />
              <div class="invalid-feedback">Vui lòng nhập giá tiền !</div>
            </div>
          </div>
          <div class="form-group info__content__unit">
            <label for=""
              >Đơn vị (thùng, hộp,...)
              <span class="required-note">*</span>:</label
            >
            <div class="input-box">
              <select
                v-model="newBeer.beer_unit"
                class="form-select form-control"
                aria-label=""
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
              <span class="required-note">*</span>:</label
            >
            <div class="input-box">
              <input
                v-model="newBeer.bottle_amount"
                type="number"
                class="form-control"
                required
              />
              <div class="invalid-feedback">Vui lòng điền số lượng !</div>
            </div>
          </div>
          <div class="form-group info__content__description">
            <label for="">Mô tả:</label>
            <textarea
              v-model="newBeer.description"
              rows="5"
              class="form-control"
              name="description"
            ></textarea>
          </div>
          <div class="form-group info__content__producer">
            <label for=""
              >Nhà sản xuất <span class="required-note">*</span>:</label
            >
            <div class="input-box">
              <select
                v-model="newBeer.producer"
                class="form-select form-control"
                aria-label=""
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
          <div class="images">
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
          <div class="preview-image">
            <div v-for="imgUrl in imageUrls" :key="imgUrl">
              <img :src="imgUrl" alt="" class="image-item" />
            </div>
          </div>
          <div class="action">
            <nuxt-link to="/dashboard/beers" class="btn btn-danger"
              >Hủy</nuxt-link
            >
            <button class="btn btn-primary" @click="addBeer">Thêm Bia</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '~/components/Breadcrumb.vue'

export default {
  components: { Breadcrumb },
  layout: 'admin',
  data() {
    return {
      producers: [],
      beerUnits: [],
      nations: [],
      newBeer: {
        name: null,
        alcohol_concentration: null,
        capacity: null,
        origin_nation: null,
        price: null,
        bottle_amount: null,
        describe: null,
        producer: null,
        beer_unit: null,
      },
      imageUrls: [],
      images: [],
    }
  },
  async created() {
    const PRODUCER_URL = '/beer/producer/get_all_with_name/'
    const BEER_UNIT_URL = '/beer/unit/'
    const NATION_URL = '/beer/nation/'

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
      } catch (err) {
        alert(err)
      }
    }
  },
  methods: {
    async addBeer(event) {
      const isValid = this.validate(event)
      if (isValid) {
        const URL = '/beer/'

        if (process.client) {
          const authToken = localStorage.getItem('auth._token.local')
          try {
            const formData = new FormData()

            for (const [key, value] of Object.entries(this.newBeer)) {
              formData.append(key, value)
            }

            for (const image of this.images) {
              formData.append('images', image)
            }

            await this.$axios.post(`/api/v1${URL}`, formData, {
              headers: {
                Authorization: authToken,
                'Content-Type': 'multipart/form-data',
              },
            })
            this.$router.push('/dashboard/beers')
          } catch (err) {
            alert(err)
          }
        }
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
    // align-items: center;

    .notion {
      width: 100%;
      text-align: left;
    }
    .required-note {
      color: red;
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
  .input-box {
    display: flex;
    flex-direction: column;
  }
}
.preview-image {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 50px;
  background-color: $breadcrumbBgrColor;
}
.image-item {
  width: 200px;
  display: inline-block;
  margin: 10px;
}
.btn {
  width: 100px;
  margin-bottom: 30px;
}
</style>
