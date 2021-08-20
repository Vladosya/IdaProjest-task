<template>
  <ClientOnly>
    <div class="container" @click.self="closeWindowGood">
      <div class="goodsPage" @click.self="closeWindowGood">
        <div class="goodsPage-header" @click.self="closeWindowGood">
          <div class="goodsPage-header__title">Добавление товара</div>
          <div class="goodsPage-header__sort">
            <select v-model="needSortGoods" @change="sortGoods">
              <option selected disabled>По умолчанию</option>
              <option>По цене min</option>
              <option>По цене max</option>
              <option>По наименованию</option>
            </select>
          </div>
        </div>
        <div class="goodsPage-content">
          <div class="addGoods">
            <div class="addGoods-block">
              <form @submit.prevent="submitFormAddGoods">
                <div class="addGoods-block__name">
                  <label for="name"
                    >Наименование товара
                    <p></p
                  ></label>
                  <input
                    id="name"
                    v-model.trim="formAddGoods.name"
                    maxlength="32"
                    type="text"
                    placeholder="Введите наименование товара"
                    :class="status($v.formAddGoods.name)"
                    @blur="$v.formAddGoods.name.$touch()"
                  />
                  <div
                    v-if="
                      $v.formAddGoods.name.$error ||
                      ($v.formAddGoods.name.$dirty &&
                        !$v.formAddGoods.name.required)
                    "
                    class="invalid-feed"
                  >
                    Поле является обязательным
                  </div>
                </div>
                <div class="addGoods-block__description">
                  <label for="description"> Описание товара </label>
                  <textarea
                    id="description"
                    v-model.trim="formAddGoods.description"
                    maxlength="120"
                    placeholder="Введите описание товара"
                  ></textarea>
                </div>
                <div class="addGoods-block__link">
                  <label for="link">
                    Ссылка на изображение товара
                    <p></p>
                  </label>
                  <input
                    id="link"
                    v-model.trim="formAddGoods.link"
                    type="text"
                    placeholder="Введите ссылку"
                    :class="status($v.formAddGoods.link)"
                    @blur="$v.formAddGoods.link.$touch()"
                  />
                  <div
                    v-if="
                      $v.formAddGoods.link.$error ||
                      ($v.formAddGoods.link.$dirty &&
                        !$v.formAddGoods.link.required)
                    "
                    class="invalid-feed"
                  >
                    Поле является обязательным
                  </div>
                </div>
                <div class="addGoods-block__price">
                  <label for="price">
                    Цена товара
                    <p></p>
                  </label>
                  <input
                    id="price"
                    v-model.trim="formAddGoods.price"
                    type="number"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength)"
                    maxlength="9"
                    placeholder="Введите цену"
                    :class="status($v.formAddGoods.price)"
                    @blur="$v.formAddGoods.price.$touch()"
                  />
                  <div
                    v-if="
                      $v.formAddGoods.price.$error ||
                      ($v.formAddGoods.price.$dirty &&
                        !$v.formAddGoods.price.required)
                    "
                    class="invalid-feed"
                  >
                    Поле является обязательным
                  </div>
                </div>
                <div class="addGoods-block__btn">
                  <button type="sumbit" @click.prevent="submitFormAddGoods">
                    Добавить товар
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div
            v-if="$store.state.goods.length > 0"
            class="listGoods-block"
            @click.self="closeWindowGood"
          >
            <button
              v-for="(g, index) in goods"
              :key="g.id"
              class="listGoods-block__btnGood"
              @click="openWindowGood(g.id)"
            >
              <div
                class="listGoods-good"
                :class="{
                  active:
                    $store.state.goods[index].isActive &&
                    $store.state.activeGood,
                }"
              >
                <div class="listGoods-good__img">
                  <img :src="g.link" alt="good-img" />
                </div>
                <div class="listGoods-info">
                  <div class="listGoods-info__title">{{ g.name }}</div>
                  <div class="listGoods-info__text">
                    {{ g.description }}
                  </div>
                  <div class="listGoods-info__price">{{ g.price }} руб.</div>
                </div>
                <button
                  v-if="$store.state.goods[index].isActive"
                  class="listGoods-good__remove"
                  @click="deleteGood(g.id)"
                >
                  <img
                    src="@/assets/images/delete-good.svg"
                    alt="delete-good"
                  />
                </button>
              </div>
            </button>
          </div>
          <div v-if="$store.state.goods.length === 0" class="listGoods-not">
            <p>Извините, товаров нет :((</p>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script lang="ts">
import Vue from "vue"
import { required } from "vuelidate/lib/validators"

export type ValidationType = {
  $anyDirty: boolean
  $anyError: boolean
  $dirty: boolean
  $error: boolean
  $invalid: boolean
  $model: any[]
  $params: any
  $pending: boolean
  required: boolean
}

type DataHomeType = {
  needSortGoods: string
  formAddGoods: {
    name: string
    description: string
    link: string
    price: string
  }
}

export default Vue.extend({
  data(): DataHomeType {
    return {
      needSortGoods: "По умолчанию",
      formAddGoods: {
        name: "",
        description: "",
        link: "",
        price: "",
      },
    }
  },
  computed: {
    goods() {
      return this.$store.getters.goods
    },
  },
  created() {
    if (process.client) {
      if (localStorage.getItem("goods") !== null) {
        this.$store.commit("addGoodsOldValues")
      }
    }
  },
  methods: {
    async submitFormAddGoods() {
      this.$v.$touch()

      if (this.$v.$invalid) {
        // eslint-disable-next-line no-console
        console.log("Error")
      } else {
        // eslint-disable-next-line no-console
        console.log("Success")

        const formData = {
          name: this.formAddGoods.name,
          description: this.formAddGoods.description,
          link: this.formAddGoods.link,
          price: Number(this.formAddGoods.price),
          isActive: false,
        }

        try {
          await this.$store.dispatch("addGood", formData)
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log("error in submitFormAddGoods method", error)
        }
      }
    },
    openWindowGood(id: number) {
      if (
        !this.$store.state.activeGood &&
        this.$store.state.idActiveGood === null
      ) {
        this.$store.dispatch("openWindowGood", id)
      } else {
        this.closeWindowGood()
      }
    },
    closeWindowGood() {
      this.$store.dispatch("closeWindowGood")
    },
    deleteGood(id: number) {
      this.$store.dispatch("deleteGood", id)
    },
    sortGoods() {
      if (this.$store.state.goods.length > 0) {
        if (this.needSortGoods === "По цене min") {
          this.$store.commit("sortGoodByLow")
        } else if (this.needSortGoods === "По цене max") {
          this.$store.commit("sortGoodByHigh")
        } else {
          this.$store.commit("sortGoodByName")
        }
      }
    },
    status(validation: ValidationType) {
      return {
        "is-invalid": validation.$error,
      }
    },
  },
  validations: {
    formAddGoods: {
      name: {
        required,
      },
      description: {},
      link: {
        required,
      },
      price: {
        required,
      },
    },
  },
})
</script>

<style lang="scss" scoped>
@import "assets/settings.scss";

.container {
  height: 100vh;
  max-width: 100%;
}

.goodsPage {
  margin: 0 auto;
  padding: 32px 32px 0;
  max-width: 1440px;
  background: rgba(255, 254, 251, 0.8);
}

.goodsPage-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__title {
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 600;
    font-style: normal;
    font-size: 28px;
    line-height: 35px;
    color: #3f3f3f;
  }

  &__sort {
    select {
      border-radius: 4px;
      width: 121.49px;
      height: 36px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      background: #fffefb;

      option {
        font-family: "Source Sans Pro", sans-serif;
        font-weight: 400;
        font-style: normal;
        font-size: 12px;
        line-height: 15px;
      }
    }

    @media (max-width: 432px) {
      margin-top: 5px;
    }
  }

  @media (max-width: 575px) {
    flex-wrap: wrap;
  }

  @media (max-width: 432px) {
    justify-content: center;
  }
}

.goodsPage-content {
  display: grid;
  grid-column-gap: 16px;
  grid-template-columns: 24.3% 75.7%;
  margin-top: 16px;

  @media (max-width: 1280px) {
    display: flex;
    flex-flow: column;
    flex-wrap: wrap;
    align-items: center;
  }
}

.addGoods {
  border-radius: 4px;
  width: 100%;
  height: 100%;
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.04), 0 6px 10px rgba(0, 0, 0, 0.02);
  background: #fffefb;

  &__block {
    padding: 24px;
  }

  @media (max-width: 1280px) {
    width: 60%;
  }
}

.addGoods-block {
  padding: 24px;

  &__name {
    label {
      display: flex;
      font-family: "Source Sans Pro", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 10px;
      line-height: 13px;
      letter-spacing: -0.02em;
      color: #49485e;

      p {
        border-radius: 4px;
        width: 4px;
        height: 4px;
        background: #ff8484;
      }
    }

    input {
      margin-top: 4px;
      border-radius: 4px;
      padding-left: 16px;
      width: 100%;
      height: 36px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      font-family: "Source Sans Pro", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 12px;
      line-height: 15px;
      color: #3f3f3f;
      background: #fffefb;
    }
  }

  &__description {
    margin-top: 16px;

    label {
      display: flex;
      font-family: "Source Sans Pro", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 10px;
      line-height: 13px;
      letter-spacing: -0.02em;
      color: #49485e;
    }

    textarea {
      margin-top: 4px;
      border-radius: 4px;
      padding: 10px 16px 0;
      width: 100%;
      height: 108px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      font-family: "Source Sans Pro", sans-serif;
      color: #3f3f3f;
      background: #fffefb;
      resize: none;
    }
  }

  &__link {
    margin-top: 16px;

    label {
      display: flex;
      font-family: "Source Sans Pro", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 10px;
      line-height: 13px;
      letter-spacing: -0.02em;
      color: #49485e;

      p {
        border-radius: 4px;
        width: 4px;
        height: 4px;
        background: #ff8484;
      }
    }

    input {
      margin-top: 4px;
      border-radius: 4px;
      padding-left: 16px;
      width: 100%;
      height: 36px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      font-family: "Source Sans Pro", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 12px;
      line-height: 15px;
      color: #3f3f3f;
      background: #fffefb;
    }
  }

  &__price {
    margin-top: 16px;

    label {
      display: flex;
      font-family: "Source Sans Pro", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 10px;
      line-height: 13px;
      letter-spacing: -0.02em;
      color: #49485e;

      p {
        border-radius: 4px;
        width: 4px;
        height: 4px;
        background: #ff8484;
      }
    }

    input {
      margin-top: 4px;
      border-radius: 4px;
      padding-left: 16px;
      width: 100%;
      height: 36px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      font-family: "Source Sans Pro", sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 12px;
      line-height: 15px;
      color: #3f3f3f;
      background: #fffefb;
    }
  }

  &__btn {
    margin-top: 24px;

    button {
      border-radius: 10px;
      width: 100%;
      height: 36px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      font-family: "Source Sans Pro", sans-serif;
      font-weight: 600;
      font-style: normal;
      font-size: 12px;
      line-height: 15px;
      color: #fff;
      background: #7bae73;

      &:hover {
        background-color: #71c564;
      }
    }
  }
}

.listGoods-block {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  &__btnGood {
    width: 332px;
    height: 423px;
    background: none;

    @media (max-width: 575px) {
      width: 232px;
      height: 323px;
    }
  }

  @media (max-width: 1440px) {
    justify-content: center;
    margin-top: 20px;
  }
}

.listGoods-good {
  position: relative;
  border-radius: 4px;
  width: 332px;
  height: 423px;
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.04), 0 6px 10px rgba(0, 0, 0, 0.02);
  background: #fffefb;

  &__img {
    width: 332px;
    height: 200px;

    img {
      width: 332px;
      height: 200px;

      @media (max-width: 575px) {
        width: 232px;
        height: 100px;
      }
    }

    @media (max-width: 575px) {
      width: 232px;
      height: 100px;
    }
  }

  &__remove {
    position: absolute;
    right: -10px;
    top: -11px;
    border-radius: 10px;
    width: 32px;
    height: 32px;
    box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
    background: #ff8484;

    &:hover {
      margin: 2px 0 0;
    }
  }

  @media (max-width: 575px) {
    width: 232px;
    height: 323px;
  }
}

.active {
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
}

.listGoods-info {
  padding: 16px 24px 0;
  text-align: left;

  &__title {
    width: 201px;
    height: 25px;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 600;
    font-style: normal;
    font-size: 17px;
    line-height: 25px;
    color: #3f3f3f;
  }

  &__text {
    margin-top: 16px;
    width: 300px;
    height: 80px;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    line-height: 20px;
    color: #3f3f3f;
  }

  &__price {
    margin-top: 32px;
    width: 117px;
    height: 30px;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 600;
    font-style: normal;
    font-size: 18px;
    line-height: 30px;
    color: #3f3f3f;
  }
}

.listGoods-not {
  display: flex;
  justify-content: center;

  p {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
  }

  @media (max-width: 1280px) {
    margin-top: 120px;
  }
}

.is-invalid {
  border: 1px solid #ff8484;
}

.invalid-feed {
  margin-top: 5px;
  font-family: "Source Sans Pro", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 8px;
  line-height: 10px;
  letter-spacing: -0.02em;
  color: #ff8484;

  @include breakpoint(Dxxxl) {
    font-size: 26px;
  }

  @include breakpoint(Dxxl) {
    font-size: 17px;
  }

  @include breakpoint(Dxl) {
    font-size: 13px;
  }

  @include breakpoint(Dlg) {
    font-size: 13px;
  }

  @include breakpoint(Ds) {
    font-size: 9px;
  }
}
</style>
