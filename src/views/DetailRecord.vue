<template>
    <loader v-if="loading"/>

    <div v-else-if="record">
        <div class="breadcrumb-wrap">
            <router-link to="/history" class="breadcrumb">История</router-link>
            <a 
                class="breadcrumb"
                @click.prevent
            >
                {{ record.typeText }}
            </a>
        </div>
        <div class="row">
            <div class="col s12 m6">
                <div 
                    class="card"
                    :class="[record.color]"
                >
                    <div class="card-content white-text">
                        <p>Описание: {{record.description}}</p>
                        <p>Сумма: {{getCurrency(record.amount)}}</p>
                        <p>Категория: {{record.categoryName}}</p>

                        <small>{{$filters.dateFilter(record.date, 'datetime')}}</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <p class="center" v-else>Запись с id={{$route.params.id}} не найдена</p>
</template>

<script>
import Loader from '../components/app/Loader.vue';
export default {
  components: { Loader },
    name: 'detail',
    data: () => ({
        record: null,
        loading: true
    }),
    async mounted() {
        const id = this.$route.params.id;
        const record = await this.$store.dispatch('fetchRecordById', id);
        const category = await this.$store.dispatch('fetchCategoryById', record.category);
        
        this.record = {
            ...record,
            categoryName: category.title,
            typeText:  (record.type=== 'income') ? 'Доход' : 'Расход',
            color: (record.type=== 'income') ? 'green' : 'red'
        }

        this.loading = false;
    },
    methods: {
        getCurrency(cur) {
            return new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB'
            }).format(cur)
        }
    },
    computed: {
    }
}
</script>