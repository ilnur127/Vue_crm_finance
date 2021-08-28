import firebase from 'firebase/app'
import store from '../store'
export default {
    actions: {
        async login({ dispatch, commit }, { email, password }) {
            try {
                await firebase.auth().signInWithEmailAndPassword(email, password);
                return { dispatch, commit };
            } catch (e) {
                let error = e;
                store.commit('setError', e);
                throw error;
            }
        },
        async logout() {
            await firebase.auth().signOut();
            store.commit('clearInfo')
        },
        async register({ dispatch }, { email, password, name }) {
            try {
                await firebase.auth().createUserWithEmailAndPassword(email, password)
                const uid = await dispatch('getUid');
                await firebase.database().ref(`/users/${uid}/info`).set({
                    bill: 10000,
                    name
                })
            } catch (e) {
                let error = e;
                store.commit('setError', e);
                throw error;
            }
        },
        getUid() {
            const user = firebase.auth().currentUser;
            return user ? user.uid : null
        }
    }
}