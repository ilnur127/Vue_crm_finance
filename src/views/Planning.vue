<template>
    <div>
        <div class="page-title">
            <h3>Планирование</h3>
            <h4>{{getCurrency(this.$store.getters.info.bill)}}</h4>
        </div>
        <Loader v-if="loading"/>
        <p class="center" v-else-if="!categories.length">Категорий пока нет. <router-link to="/categories">Добавте новую категорию</router-link></p>
        <section v-else>
            <div 
                v-for="cat of categories"
                :key="cat.id"
            >
                <p>
                    <strong>{{cat.title}}:</strong>
                    {{getCurrency(cat.spend)}} из {{getCurrency(cat.limit)}}
                </p>
                <div 
                    class="progress" 
                    v-tooltip="cat.tooltip"
                >
                    <div
                        class="determinate"
                        :class="[cat.progressColor]"
                        :style="{width: `${cat.progressPercent}%`}"
                    ></div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Loader from '../components/app/Loader.vue';
export default {
    components: { Loader },
    name: 'planning',
    data: () => ({
        loading: true,
        categories: []
    }),
    computed: {
        ...mapGetters(['info'])
    },
    methods: {
        getCurrency(cur) {
            return new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB'
            }).format(cur)
        }
    },
    async mounted() {
        const records = await this.$store.dispatch('fetchRecords');
        const categories = await this.$store.dispatch('fetchCategories');
        console.log(records)

        this.categories = categories.map(cat => {
            let spend = records.filter(r => {
                                if(r.category === cat.id) return r;
                            }).filter(r => {
                                if(r.type == "outcome") return r;
                            }).reduce((total, record) => {
                                return total += +record.amount
                            },0);

            const percent = (100 * spend / cat.limit);
            const progressPercent = percent > 100 ? 100 : percent;
            const progressColor = percent < 60
                                    ? 'green'
                                    : percent < 100
                                        ? 'yellow'
                                        : 'red';
            const tooltipValue = cat.limit - spend;
            const tooltip = `${tooltipValue < 0 ? 'Превышение на' : 'Осталось'} ${this.getCurrency(Math.abs(tooltipValue))}`
            return {
                ...cat,
                progressPercent,
                progressColor,
                spend,
                tooltip
            }
        })
        this.loading = false;
    }
}
</script>