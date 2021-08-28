<template>
    <div>
        <div class="page-title">
            <h3>Категории</h3>
        </div>
        <section>
            <Loader 
                v-if="loading"
            />
            <div v-else class="row">
                <CategoryCreate 
                    @created="addNewCategories"
                />
                <CategoryEdit
                    v-if="categories.length"
                    :categories="categories"
                    :key="categories.length + updateCount"
                    @updated="updatedCategory"
                />
                <p
                    v-else
                    class="center"
                >
                    Категорий пока нет
                </p>
            </div>
        </section>
    </div>
</template>

<script>
import Loader from '../components/app/Loader.vue';
import CategoryCreate from '../components/CategoryCreate'
import CategoryEdit from '../components/CategoryEdit'
export default {
    name: 'categories',
    data: () => ({
        categories: [],
        loading: true,
        updateCount: 0
    }),
    methods:{
        addNewCategories(category){
            this.categories.push(category);
        },
        updatedCategory(category){
            const idx = this.categories.findIndex(c => c.id === category.id);
            this.categories[idx].title = category.title;
            this.categories[idx].limit = category.limit;
            this.updateCount++;
        }
    },
    async mounted() {
        this.categories = await this.$store.dispatch('fetchCategories');
        this.loading = false;
    },
    components: {
        CategoryCreate,
        CategoryEdit,
        Loader
    }
}
</script>