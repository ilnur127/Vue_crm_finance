import firebase from 'firebase/app'
import store from '../store'
export default {
    state: {
        info: {}
    },
    mutations: {
        setInfo(state, info) {
            state.info = info;
        },
        clearInfo(state) {
            state.info = {};
        }
    },
    actions: {
        async fetchInfo({ dispatch }) {
            try {
                const uid = await dispatch('getUid')
                const info = (await firebase.database().ref(`/users/${uid}/info`).once('value')).val();
                store.commit('setInfo', info);
            } catch (e) {
                console.log(e);
            }
        },
        async updateInfo({dispatch, commit}, toUpdate) {
            try {
                const uid = await dispatch('getUid');
                const updateData = {...this.getters.info, ...toUpdate}
                await firebase.database().ref(`/users/${uid}/info`).update(updateData);
                commit('setInfo', updateData);
            } catch (e) {
                let error = e;
                commit('setError', error);
                throw error;
            }
        }
    },
    getters: {
        info: s => s.info
    }
}