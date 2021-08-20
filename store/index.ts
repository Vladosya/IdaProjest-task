/* eslint-disable import/named */
import { GetterTree, ActionTree, MutationTree } from "vuex"
import { ActionContext } from "vuex/types"

type GoodsType = {
  id?: number
  name: string
  description: string
  link: string
  price: string
  isActive: boolean
}

type PayloadType = {
  name: string
  description: string
  link: string
  price: string
  isActive: boolean
}

type StateType = {
  goods: GoodsType[]
  activeGood: boolean
  idActiveGood: number | null
}

export const state = (): StateType => ({
  goods: [] as [] | GoodsType[],
  activeGood: false,
  idActiveGood: null,
})

export type RootState = ReturnType<typeof state>
interface CounterActionContext extends ActionContext<StateType, RootState> {}

export const mutations: MutationTree<RootState> = {
  addGood(state: StateType, payload: PayloadType) {
    state.goods.push(payload)
  },
  filterGoods(state: StateType) {
    state.goods = state.goods.map((g: GoodsType, index) => {
      return {
        id: index + 1,
        name: g.name,
        description: g.description,
        link: g.link,
        price: g.price,
        isActive: g.isActive,
      }
    })

    localStorage.setItem("goods", JSON.stringify(state.goods))
  },
  openWindowGood(state: StateType, payload: number) {
    const needIdx: number = state.goods.findIndex((g) => g.id === payload)
    state.goods[needIdx].isActive = true
    state.idActiveGood = payload
    state.activeGood = true
  },
  closeWindowGood(state: StateType) {
    if (state.activeGood === true && state.idActiveGood !== null) {
      const needIdx: number = state.goods.findIndex(
        (g) => g.id === state.idActiveGood
      )
      if (needIdx !== -1) {
        state.goods[needIdx].isActive = false
        state.idActiveGood = null
        state.activeGood = false
      } else {
        state.idActiveGood = null
        state.activeGood = false
      }
    }
  },
  deleteGood(state: StateType, payload: number) {
    state.goods = state.goods.filter((g) => g.id !== payload)
    localStorage.setItem("goods", JSON.stringify(state.goods))
  },
  sortGoodByLow(state: StateType) {
    state.goods = state.goods.sort((a: GoodsType, b: GoodsType) => {
      return +a.price - +b.price
    })
  },
  sortGoodByHigh(state: StateType) {
    state.goods = state.goods.sort((a: GoodsType, b: GoodsType) => {
      return +b.price - +a.price
    })
  },
  sortGoodByName(state: StateType) {
    state.goods = state.goods.sort((a: GoodsType, b: GoodsType) => {
      return a.name.localeCompare(b.name)
    })
  },
  addGoodsOldValues(state: StateType) {
    const noProcessedValues: any = localStorage.getItem("goods")
    const oldValues = JSON.parse(noProcessedValues)
    state.goods = oldValues
  },
}

export const actions: ActionTree<StateType, RootState> = {
  async addGood({ commit }: CounterActionContext, payload: PayloadType) {
    await commit("addGood", payload)
    commit("filterGoods")
  },
  openWindowGood({ commit }: CounterActionContext, payload: number) {
    commit("openWindowGood", payload)
  },
  closeWindowGood({ commit }: CounterActionContext) {
    commit("closeWindowGood")
  },
  deleteGood({ commit }: CounterActionContext, payload: number) {
    commit("deleteGood", payload)
  },
}

export const getters: GetterTree<StateType, RootState> = {
  goods: (state): any[] => state.goods,
}
