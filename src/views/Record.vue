<template>
    <div>
        <div class="page-title">
            <h3>Новая запись</h3>
        </div>
        <Loader v-if="loading" />

        <p class="center" v-else-if="!categories.length">Категорий пока нет. <router-link to="/categories">Добавте новую категорию</router-link></p>

        <form 
            v-else 
            class="form"
            @submit.prevent="submitForm"
        >
            <div class="input-field" >
                <select 
                    ref="select"
                    v-model="category"    
                >
                    <option 
                        v-for="c of categories"
                        :key="c.id"
                        :value="c.id"
                    >{{c.title}}</option>
                </select>
                <label>Выберите категорию</label>
            </div>

            <p>
                <label>
                    <input
                        class="with-gap"
                        name="type"
                        type="radio"
                        value="income"
                        v-model="type"
                    />
                    <span>Доход</span>
                </label>
            </p>

            <p>
                <label>
                    <input
                        class="with-gap"
                        name="type"
                        type="radio"
                        value="outcome"
                        v-model="type"
                    />
                    <span>Расход</span>
                </label>
            </p>

            <div class="input-field">
                <input
                    id="amount"
                    type="number"
                    v-model="amount"
                    @change="checkAmount"
                    :class="{invalidInput: errorAmount}"
                >
                <label for="amount">Сумма</label>
                <span 
                    class="helper-text invalid"
                    v-if="errorAmount"
                >Минимальное значение {{minAmount}}</span>
            </div>

            <div class="input-field">
                <input
                    id="description"
                    type="text"
                    v-model="description"
                    @change="checkDescription"
                    :class="{invalidInput: errorDescription}"
                >
                <label for="description">Описание</label>
                <span
                    class="helper-text invalid"
                    v-if="errorDescription"
                >Введите описание</span>
            </div>

            <button class="btn waves-effect waves-light" type="submit">
                Создать
                <i class="material-icons right">send</i>
            </button>
        </form>
    </div>
</template>

<script>
import M from 'materialize-css'
import Loader from '../components/app/Loader.vue';
import {mapGetters} from 'vuex'
export default {
    components: { 
        Loader 
    },
    name: 'record',
    data: () => ({
        loading: true,
        categories: [],
        select: null,
        category: null,
        type: 'outcome',
        amount: 1,
        minAmount: 1,
        description: "",
        errorAmount: false,
        errorDescription: false
    }),
    methods:{
        checkAmount(){
            if(this.amount < this.minAmount){
                this.errorAmount = true;
            } else {
                this.errorAmount = false;
            }
        },
        checkDescription(){
            if(this.description == ''){
                this.errorDescription = true;
            } else {
                this.errorDescription = false;
            }
        },
        async submitForm(){
            this.checkAmount();
            this.checkDescription();
            if (this.errorAmount || this.errorDescription) {
                return
            }
            
            if (this.canCreateRecord) {
                const formData = {
                    category: this.category,
                    type: this.type,
                    amount: this.amount,
                    description: this.description,
                    date: new Date().toJSON()
                }

                try {
                    await this.$store.dispatch('createRecord', formData);
                    const bill = this.type === 'income'
                                    ? this.info.bill + parseInt(this.amount)
                                    : this.info.bill - parseInt(this.amount);
                    await this.$store.dispatch('updateInfo', {bill});
                    this.$message(`Запись была успешно создана`); 
                    this.amount = 1;
                    this.description = '';
                } catch (e) {
                    return;
                }
            } else {
                this.$error(`На счету недостаточно средств (${this.amount - this.info.bill})`);
            }
        }
    },
    computed: {
        ...mapGetters(['info']),
        canCreateRecord() {
            if (this.type === 'income') {
                return true;
            }

            return this.info.bill >= this.amount;
        }
    },
    async mounted() {
        this.categories = await this.$store.dispatch('fetchCategories');
        this.loading = false;
        
        if(this.categories.length) {
            this.category = this.categories[0].id;
        }

        setTimeout(() => {
            this.select = M.FormSelect.init(this.$refs.select);
            M.updateTextFields();
        }, 0);
    },
    beforeUnmount() {
        if (this.select && this.select.destroy) {
            this.select.destroy();
        }
    }
}
</script>