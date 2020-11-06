import types from '@/store/types'

const state ={
    token :localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',
}

const getters = {
    token:(state) => state.token,
}


const mutations = {
    [types.TOKEN](state,v){
        state.token = v;
    },
    [types.CLEARTOKEN](state){
        state.token = '';
        localStorage.removeItem('Authorization');
    }
}

const actions = {
    setToken:({commit},v) => {
        localStorage.setItem('Authorization',v);
        commit(types.TOKEN,v);
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
