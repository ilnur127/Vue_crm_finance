import firebase from "firebase/app";
export default {
    actions: {
        async createRecord({dispatch, commit}, record){
            try {
                const uid = await dispatch('getUid');
                const rec = await firebase.database().ref(`/users/${uid}/record`).push(record);
                console.log(rec);
            } catch (e){
                let error = e;
                commit('setError', error);
                throw error;
            }
        },
        async fetchRecords({dispatch, commit}) {
            try {
                const uid = await dispatch('getUid');
                const records = (await firebase.database().ref(`/users/${uid}/record`).once('value')).val() || [];
              
                return Object.keys(records).map((key)=>({
                        id: key,   
                        ...records[key]
                    })
                );
            } catch (e){
                let error = e;
                commit('setError', error);
                throw error;
            }
        },
        async fetchRecordById({dispatch, commit}, id) {
            try {
                const uid = await dispatch('getUid');
                const record = (await firebase.database().ref(`/users/${uid}/record`).child(id).once('value')).val() || [];
              
                return {
                    ...record,
                    id
                };
            } catch (e){
                let error = e;
                commit('setError', error);
                throw error;
            }
        },
    }
}