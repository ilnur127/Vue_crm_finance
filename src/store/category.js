import firebase from 'firebase/app'
export default {
    actions: {
        async createCategory({dispatch, commit}, {title,limit}) {
            try {
                const uid = await dispatch('getUid');
                const category = await firebase.database().ref(`/users/${uid}/categories`).push({title,limit});
                return {title, limit, id: category.key};
            } catch (e){
                let error = e;
                commit('setError', error);
                throw error;
            }
        },
        async fetchCategories({dispatch, commit}) {
            try {
                const uid = await dispatch('getUid');
                const categories = (await firebase.database().ref(`/users/${uid}/categories`).once('value')).val() || [];
              
                return Object.keys(categories).map((key)=>({
                        id: key,   
                        ...categories[key]
                    })
                );
            } catch (e){
                let error = e;
                commit('setError', error);
                throw error;
            }
        },
        async fetchCategoryById({dispatch, commit}, id) {
            try {
                const uid = await dispatch('getUid');
                const category = (await firebase.database().ref(`/users/${uid}/categories`).child(id).once('value')).val() || [];
              
                return {
                    ...category,
                    id
                };
            } catch (e){
                let error = e;
                commit('setError', error);
                throw error;
            }
        },
        async updateCategory({dispatch, commit}, {id,title,limit}) {
            try {
                const uid = await dispatch('getUid');
                await firebase.database().ref(`/users/${uid}/categories`).child(id).update({title,limit});
            } catch (e){
                let error = e;
                commit('setError', error);
                throw error;
            }
        }
    }
}