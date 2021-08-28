<template>
    <div>
        <div class="page-title">
            <h3>История записей</h3>
        </div>

        <div class="history-chart">
            <canvas ref="canvas"></canvas>
        </div>

        <Loader 
            v-if="loading"
        />
        <p class="center" v-else-if="!records.length">Записей пока нет. <router-link to="/record">Добавьте первую.</router-link></p>
        <section v-else>
            <HistoryTable 
                :records="items"
            />
            <Pagination
                :pages="pageCount"
                v-model="page"
            />
        </section>
    </div>
</template>

<script>
import paginationMixin from '../mixins/pagination.mixin'
import Loader from '../components/app/Loader.vue';
import Pagination from '../components/app/Pagination.vue';
import HistoryTable from '../components/HistoryTable.vue';
import {Pie} from 'vue-chartjs'

export default {
    name: 'history',
    mixins: [paginationMixin, Pie],
    data: () => ({
        loading: true,
        records: [],
    }),
    components: {
        HistoryTable,
        Loader,
        Pagination
    },
    async mounted() {
        this.records = await this.$store.dispatch('fetchRecords');
        const categories = await this.$store.dispatch('fetchCategories');
        
        this.setup(categories);

        this.loading = false;
    },
    methods: {
        setup(categories){
            this.setupPagination(this.records.map(record => {
                return {
                    ...record,
                    categoryName: (categories.find(c => {
                                    if (c.id === record.category){return c;}
                                })).title,
                    typeClass: record.type === 'income' ? 'green' : 'red',
                    typeText: record.type === 'income' ? 'доход' : 'рассход',
                }
            }));
            this.renderChart({
                labels: categories.map(c => c.title),
                datasets: [{
                    label: 'Рассходы по категориям',
                    data: categories.map(c => {
                        return this.records.reduce((total, r) => {
                            if (r.category === c.id && r.type === 'outcome') {
                                total += +r.amount
                            }
                            return total;
                        }, 0)
                    }),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            });
        }
    }
}
</script>