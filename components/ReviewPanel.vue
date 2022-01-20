<template>
  <div class="review-panel">
    <div class="panel-header">
      <div class="header-left">
        <div class="rating-score-wrapper">
          <div class="overall-score">{{ ratingScore }}</div>
          <div class="score-out-of">trên 5</div>
        </div>
        <rating-star-display
          :rating="ratingScore"
          :width="35"
          :height="35"
        ></rating-star-display>
      </div>
      <div class="header-right">
        <div
          v-for="option in rateFilter.options"
          :key="option.value"
          class="filter-option"
          :class="{ selected: selectedRate === option.value }"
          @click="setRatingFilter(option.value)"
        >
          {{ option.display + ` (${overallStat[option.value] || 0})` }}
        </div>
      </div>
    </div>
    <div v-if="yourReview.canMake" class="make-review">
      <div class="your-avatar-wrapper">
        <img
          class="your-avatar"
          alt="your-avatar"
          :src="user.avatar || require('~/assets/img/logo3.png')"
        />
      </div>
      <div class="your-review-content">
        <div class="content-row">
          <label for="rating" class="label-text">Đánh giá:</label>
          <div class="your-rating">
            <rating-star-display
              :interactive="true"
              :width="30"
              :height="30"
              @handleSelectRating="setRatingValue"
            ></rating-star-display>
          </div>
        </div>
        <div class="content-row">
          <label for="comment" class="label-text">Bình luận:</label>
          <textarea
            v-model.trim="yourReview.comment"
            class="your-comment"
          ></textarea>
        </div>
        <button class="submit-review" @click="handleSubmitReview">
          Gửi đánh giá
        </button>
      </div>
    </div>
    <div class="panel-content">
      <div v-if="!allReview.length" class="no-review">
        Không có đánh giá nào
      </div>
      <div v-else>
        <div
          v-for="(review, index) in allReview"
          :key="review.id"
          class="review-container"
          :class="{
            last: index === allReview.length - 1,
          }"
        >
          <div class="reviewer-avatar-wrapper">
            <img
              class="reviewer-avatar"
              :src="review.account.avatar || require('~/assets/img/logo3.png')"
            />
          </div>
          <div
            v-if="!reviewAction[review.id] || !reviewAction[review.id].editing"
            class="review-main-content"
          >
            <div class="reviewer-name">
              {{ review.account.last_name + ' ' + review.account.first_name }}
            </div>
            <div class="review-star">
              <rating-star-display
                :rating="review.rate"
                :width="16"
                :height="16"
              ></rating-star-display>
            </div>
            <div class="review-comment">{{ review.comment }}</div>
            <div class="review-time">
              {{ getTimeFormat(review.updated_at) }}
            </div>
          </div>
          <div v-else class="review-editing">
            <div class="your-review-content">
              <div class="content-row">
                <label for="rating" class="label-text">Đánh giá:</label>
                <div class="your-rating">
                  <rating-star-display
                    :interactive="true"
                    :width="30"
                    :height="30"
                    :rating="reviewAction[review.id].rate"
                    @handleSelectRating="
                      (value) => setEditRatingValue(value, review.id)
                    "
                  ></rating-star-display>
                </div>
              </div>
              <div class="content-row">
                <label for="comment" class="label-text">Bình luận:</label>
                <textarea
                  v-model.trim="reviewAction[review.id].comment"
                  class="your-comment"
                ></textarea>
              </div>
              <div class="action-wrapper">
                <button
                  class="confirm-editing"
                  @click="handleEditReview(review.id)"
                >
                  Xác nhận
                </button>
                <button
                  class="cancel-editing"
                  @click="cancelEditingReview(review.id)"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
          <div
            v-if="
              user.id === review.account.id &&
              (!reviewAction[review.id] || !reviewAction[review.id].editing)
            "
            class="review-action"
          >
            <div
              class="action-dotted-display"
              :class="{
                show_action:
                  reviewAction[review.id] && reviewAction[review.id].showAction,
              }"
              @click="changeReviewActionDisplay(review.id)"
            >
              . . .
            </div>
            <div
              v-if="
                reviewAction[review.id] && reviewAction[review.id].showAction
              "
              class="action-dropdown"
            >
              <div class="action-select" @click="startEditingReview(review.id)">
                Sửa
              </div>
              <div class="action-select" @click="handleDeleteReview(review.id)">
                Xóa
              </div>
            </div>
          </div>
        </div>
        <div v-if="isLoadingMore" class="is-loading-more">...</div>
      </div>
    </div>
    <base-dialog
      v-if="notification.title"
      :title="notification.title"
      @close="notification = {}"
    >
      <template #default
        ><h3>{{ notification.message }}</h3></template
      ></base-dialog
    >
  </div>
</template>

<script>
import RatingStarDisplay from './RatingStarDisplay.vue'
import BaseDialog from './Modal/BaseDialog.vue'
import { getTimeFormat } from '~/helper/helper'
export default {
  components: {
    RatingStarDisplay,
    BaseDialog,
  },
  props: ['beerId'],
  data() {
    return {
      ratingScore: 0,
      allReview: [],
      rateFilter: {
        options: [
          {
            value: 'all',
            display: 'Tất cả',
          },
          {
            value: 1,
            display: '1 sao',
          },
          {
            value: 2,
            display: '2 sao',
          },
          {
            value: 3,
            display: '3 sao',
          },
          {
            value: 4,
            display: '4 sao',
          },
          {
            value: 5,
            display: '5 sao',
          },
        ],
      },
      overallStat: {
        all: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
      selectedRate: null,
      isLoadingMore: false,
      nextPage: null,
      yourReview: {
        canMake: false,
        ratingScore: 0,
        comment: '',
      },
      notification: {
        title: null,
        message: null,
      },
      reviewAction: {},
    }
  },
  computed: {
    user() {
      return this.$auth.user
    },
  },
  watch: {
    selectedRate() {
      this.fetchReview()
    },
  },
  created() {
    /**
     * on component created, we will set the selected rate to "all", which will trigger
     * selectedRate's watcher to trigger and fetch review data
     * we also fetch the permission to make new review and overall review stat
     */
    this.selectedRate = 'all'
    this.checkCanReview()
    this.fetchReviewOverallStat()
    this.fetchAverageRatingScore()
  },
  methods: {
    getTimeFormat,
    makeNewReviewURL() {
      return '/api/v1/account/review'
    },
    editReviewURL(reviewId) {
      return '/api/v1/account/review/' + reviewId
    },
    deleteReviewURL(reviewId) {
      return '/api/v1/account/review/' + reviewId
    },
    fetchReviewURL() {
      return (
        '/api/v1/account/review/get_by_beer/?beer_id=' +
        this.beerId +
        (this.selectedRate === 'all' ? '' : '&rate=' + this.selectedRate)
      )
    },
    fetchReviewOverallStatURL() {
      return (
        '/api/v1/account/review/get_all_rate_amount/?beer_id=' + this.beerId
      )
    },
    fetchAverageRatingScoreURL() {
      return '/api/v1/account/review/rate/?beer_id=' + this.beerId
    },
    checkCanReviewURL() {
      return '/api/v1/account/review/check_can_review/?beer_id=' + this.beerId
    },
    /**
     * this method is used to set rating filter
     */
    setRatingFilter(value) {
      this.selectedRate = value
    },
    /**
     * this method is used to fetch the permission to review
     */
    async checkCanReview() {
      try {
        if (!this.user) {
          this.yourReview.canMake = false
          return
        }
        const authToken = localStorage.getItem('auth._token.google')
        const { data } = await this.$axios.get(this.checkCanReviewURL(), {
          headers: { Authorization: authToken },
        })
        this.yourReview.canMake = data.detail
      } catch (err) {
        console.log(err.response || err)
      }
    },
    /**
     * this method is used to handle review submitting
     */
    async handleSubmitReview() {
      if (!this.yourReview.ratingScore)
        return (this.notification = {
          ...this.notification,
          title: 'Lỗi',
          message: 'Vui lòng chọn mức đánh giá',
        })
      if (!this.yourReview.comment)
        return (this.notification = {
          ...this.notification,
          title: 'Lỗi',
          message: 'Vui lòng nhập đánh giá',
        })
      try {
        const authToken = localStorage.getItem('auth._token.google')
        await this.$axios.post(this.makeNewReviewURL(), {
          rate: this.yourReview.ratingScore,
          comment: this.yourReview.comment,
          beer: this.beerId,
          headers: { Authorization: authToken },
        })
        if (!this.selectedRate === 'all') {
          this.selectedRate = 'all'
        } else {
          this.fetchReview()
        }
        this.checkCanReview()
        this.fetchReviewOverallStat()
        this.fetchAverageRatingScore()
      } catch (err) {
        console.log(err.response || err)
      }
    },
    /**
     * this method is used to handle review editing
     */
    async handleEditReview(reviewId) {
      if (this.reviewAction[reviewId].comment === '') {
        return (this.notification = {
          ...this.notification,
          title: 'Lỗi',
          message: 'Vui lòng nhập vào bình luận',
        })
      }
      try {
        await this.$axios.patch(this.editReviewURL(reviewId), {
          comment: this.reviewAction[reviewId].comment,
          rate: this.reviewAction[reviewId].rate,
        })
        this.fetchReview()
        this.fetchReviewOverallStat()
        this.fetchAverageRatingScore()
        this.reviewAction = {
          ...this.reviewAction,
          [reviewId]: null,
        }
      } catch (err) {
        console.log(err.response || err)
      }
    },
    /**
     * this method is used to handle review deleting
     */
    async handleDeleteReview(reviewId) {
      try {
        await this.$axios.delete(this.deleteReviewURL(reviewId))
        this.fetchReview()
        this.checkCanReview()
        this.fetchReviewOverallStat()
        this.fetchAverageRatingScore()
      } catch (err) {
        console.log(err.response || err)
      }
    },
    /**
     * this method is used to fetch review with rate
     */
    async fetchReview() {
      try {
        const { data } = await this.$axios.get(this.fetchReviewURL())
        this.allReview = data.results
        this.nextPage = data.next
      } catch (err) {
        console.log(err.response.data || err)
      }
    },
    /**
     * this method is used to fetch this beer review overall statistic
     */
    async fetchReviewOverallStat() {
      try {
        const { data } = await this.$axios.get(this.fetchReviewOverallStatURL())
        const { overallStat } = data.reduce(
          (prev, cur) => ({
            overallStat: {
              ...prev.overallStat,
              [cur.rate]: cur.total,
              total: prev.overallStat.total + cur.total,
            },
          }),
          { overallStat: { total: 0 } }
        )
        this.overallStat = {
          ...overallStat,
          all: overallStat.total,
        }
      } catch (err) {
        console.log(err.response.data || err)
      }
    },
    /**
     * this method is used to fetch this beer review overall statistic
     */
    async fetchAverageRatingScore() {
      try {
        const { data } = await this.$axios.get(
          this.fetchAverageRatingScoreURL()
        )
        this.ratingScore = data.beer_avg_rate || 0
      } catch (err) {
        console.log(err.response.data || err)
      }
    },
    /**
     * this method is used to check if we should fetch more review, used in lazy loading
     */
    shouldFetchMoreReview() {
      const reviewPanelElement = document.querySelector('.review-panel')
      const distance = reviewPanelElement.getBoundingClientRect().bottom
      return (
        distance < 0.8 * window.innerHeight &&
        !this.isLoadingMore &&
        this.nextPage
      )
    },
    /**
     * this method is used to fetch more review
     */
    async fetchMoreReview() {
      try {
        if (!this.shouldFetchMoreReview()) return
        // loading more review here
        this.isLoadingMore = true
        const authToken = localStorage.getItem('auth._token.google')
        const { data } = await this.$axios.get(this.nextPage, {
          Authorization: authToken,
        })
        this.allReview.push(...data.results)
        this.nextPage = data.next
        this.isLoadingMore = false
      } catch (err) {
        console.log(err.response || err)
      }
    },
    // this method is used for assigning user rating value when submit review
    setRatingValue(value) {
      this.yourReview.ratingScore = value
    },
    setEditRatingValue(value, reviewId) {
      this.reviewAction = {
        ...this.reviewAction,
        [reviewId]: {
          ...this.reviewAction[reviewId],
          rate: value,
        },
      }
    },
    changeReviewActionDisplay(reviewId) {
      this.reviewAction = {
        ...this.reviewAction,
        [reviewId]: {
          ...this.reviewAction[reviewId],
          showAction: !this.reviewAction[reviewId]?.showAction,
        },
      }
    },
    changeReviewEditingStatus(reviewId) {
      this.reviewAction = {
        ...this.reviewAction,
        [reviewId]: {
          ...this.reviewAction[reviewId],
          editing: !this.reviewAction[reviewId]?.editing,
        },
      }
    },
    startEditingReview(reviewId) {
      const review = this.allReview.find(({ id }) => id === reviewId)
      this.reviewAction = {
        ...this.reviewAction,
        [reviewId]: {
          editing: true,
          comment: review.comment,
          rate: review.rate,
        },
      }
    },
    cancelEditingReview(reviewId) {
      this.reviewAction = {
        ...this.reviewAction,
        [reviewId]: null,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';

.panel-header {
  width: 100%;
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
  /* background: $white2; */
}

.header-left {
  width: fit-content;
  padding: 0 3% 0 0;

  .rating-score-wrapper {
    width: fit-content;
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    margin: 0 auto 10px auto;
    color: $red;
    padding: 0 15%;
    .overall-score {
      font-size: 28px;
      font-weight: 500;
      margin-right: 5px;
    }

    .score-out-of {
      font-size: 18px;
      padding-bottom: 2px;
    }
  }
  .rating-overview-star {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    column-gap: 3px;
  }
}

.header-right {
  width: 75%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  column-gap: 15px;

  .filter-option {
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.09);
    background: $white;
    padding: 5px 7px;
    border-radius: 3px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .filter-option:hover {
    border: 1px solid $red;
    color: $red;
  }

  .filter-option.selected {
    border: 1px solid $red;
    color: $red;
  }
}

.make-review {
  padding: 30px 30px 50px 30px;
  width: 100%;
  height: fit-content;
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);

  .your-avatar-wrapper {
    width: 15%;
    padding-bottom: 15%;
    height: 0;
    position: relative;

    .your-avatar {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .your-review-content {
    width: 85%;
    padding-left: 10%;

    .content-row {
      display: flex;
      width: 100%;
    }

    .label-text {
      padding: 0 5% 0 0;
      margin: 0;
      width: 30%;
    }

    .your-rating {
      width: 100%;
      margin-bottom: 25px;
    }

    .your-comment {
      padding: 5px;
      border: 1px solid rgba(0, 0, 0, 0.29);
      width: 100%;
      resize: none;
    }

    .your-comment:focus {
      border: 1px solid rgba(0, 0, 0, 0.8);
      outline: none;
      height: 100%;
    }
  }

  .submit-review {
    display: block;
    margin: 20px 0 0 auto;
    padding: 5px;
    border: 1px solid $red;
    background: $white;
    color: $red;
    border-radius: 3px;
    transition: 0.3s ease-in-out;
  }

  .submit-review:hover {
    background: $red;
    color: $white;
    transition: 0.3s ease-in-out;
  }
}

.panel-content {
  width: 100%;

  .no-review {
    padding: 50px 30px;
    width: 100%;
    text-align: center;
  }

  .is-loading-more {
    padding: 30px 30px;
    width: 100%;
    text-align: center;
    font-size: 30px;
  }

  .review-container {
    width: 100%;
    height: fit-content;
    padding: 30px 50px;
    display: flex;
    border-bottom: 1px solid rgba(0, 0, 0, 0.09);

    .reviewer-avatar-wrapper {
      width: 7%;
      padding-bottom: 7%;
      height: 0;
      position: relative;

      .reviewer-avatar {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        border-radius: 50%;
      }
    }

    .review-main-content {
      width: 90%;
      padding-left: 5%;

      .reviewer-name {
        font-size: 15px;
        font-weight: 200;
      }

      .review-star {
        width: fit-content;
        height: fit-content;
        margin-bottom: 25px;
      }

      .review-comment {
        margin-bottom: 25px;
      }

      .review-time {
        font-size: 15px;
        font-weight: 200;
      }
    }

    .review-editing {
      width: 90%;
      .your-review-content {
        width: 100%;
        padding-left: 10%;

        .content-row {
          display: flex;
          width: 100%;
        }

        .label-text {
          padding: 0 5% 0 0;
          margin: 0;
          width: 30%;
        }

        .your-rating {
          width: 100%;
          margin-bottom: 25px;
        }

        .your-comment {
          padding: 5px;
          border: 1px solid rgba(0, 0, 0, 0.29);
          width: 100%;
          resize: none;
        }

        .your-comment:focus {
          border: 1px solid rgba(0, 0, 0, 0.8);
          outline: none;
          height: 100%;
        }

        .action-wrapper {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-top: 20px;
        }

        button {
          display: block;
          padding: 5px;
          border: 1px solid $red;
          background: $white;
          color: $red;
          border-radius: 3px;
          transition: 0.3s ease-in-out;
        }

        button:hover {
          background: $red;
          color: $white;
          transition: 0.3s ease-in-out;
        }

        .confirm-editing {
          margin-right: 10px;
        }
      }
    }

    .review-action {
      position: relative;
    }

    .action-dotted-display {
      margin: 0;
      font-size: 25px;
      font-weight: 500;
      padding: 5px 15px;
      height: 50px;
      line-height: 10px;
      width: 35px;
      cursor: pointer;
      border-radius: 20px;
    }

    .action-dotted-display:not(.show_action) {
      display: none;
    }

    .action-dotted-display:hover {
      background: $white2;
    }

    .action-dropdown {
      height: fit-content;
      width: 100px;
      position: absolute;
      top: 50px;
      border: 1px solid rgba(0, 0, 0, 0.29);
      padding: 5px;
      z-index: 3;
      border-radius: 3px;

      .action-select {
        padding: 5px;
        cursor: pointer;
        background: $white;
        border-radius: 5px;
      }

      .action-select:hover {
        background: $white2;
      }
    }
  }

  .review-container:hover {
    .action-dotted-display {
      display: block;
    }
  }

  .review-container.last {
    border: none;
    padding-bottom: 0;
  }
}
</style>
