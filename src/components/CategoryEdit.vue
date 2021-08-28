<template>
    <div class="col s12 m6">
        <div class="page-subtitle">
            <h4>Редактировать</h4>
        </div>

        <form @submit.prevent="submitForm">
            <div class="input-field" >
                <select 
                    ref="select"
                    v-model="current"
                >
                    <option
                        v-for="c of categories"
                        :key="c.id"
                        :value="c.id"
                    >{{c.title}}</option>
                </select>
                <label>Выберите категорию</label>
            </div>

            <div class="input-field">
                <input
                    id="nameEdit"
                    type="text"
                    v-model="title"
                    :class="{invalidInput: errorTitle}"
                    @change="checkTitle"
                >
                <label for="nameEdit">Название</label>
                <span v-if="errorTitle" class="helper-text invalid">Введите название категории</span>
            </div>

            <div class="input-field">
                <input
                    id="limitEdit"
                    type="number"
                    v-model.number="limit"
                    :class="{invalidInput: errorLimit}"
                    @change="checkLimit"
                >
                <label for="limitEdit">Лимит</label>
                <span v-if="errorLimit" class="helper-text invalid">Минимальное значение {{minLimit}}</span>
            </div>

            <button class="btn waves-effect waves-light" type="submit">
                Обновить
                <i class="material-icons right">send</i>
            </button>
        </form>
    </div>
</template>

<script>
import M from 'materialize-css'
export default {
    data:() => ({
        select: null,
        title: '',
        limit: 100,
        minLimit: 100,
        errorTitle: false,
        errorLimit: false,
        current: null
    }),
    props: {
        categories: {
            type: Array,
            required: true
        }
    },
    methods:{
        checkTitle(){
            if(this.title == ''){
                this.errorTitle = true;
            } else {
                this.errorTitle = false;
            }
        },
        checkLimit(){
            if(this.limit <= this.minLimit){
                this.errorLimit = true;
            } else {
                this.errorLimit = false;
            }
        },
        async submitForm(){
            this.checkTitle();
            this.checkLimit();
            if (this.errorTitle || this.errorLimit) {
                return
            }
            const formData = {
                id: this.current,
                title: this.title,
                limit: this.limit,
            }

            try {
                await this.$store.dispatch('updateCategory', formData);
                this.$message(`Категория ${this.title} была успешно обновлена`);
                this.$emit('updated',formData);
            } catch (e) {
                return;
            }
        }
    },
    watch: {
        current(catId){
            const {title, limit} = this.categories.find(c => c.id === catId);
            this.title = title;
            this.limit = limit;
        }
    },
    created() {
        const {id, title, limit} = this.categories[0];
        this.current = id;
        this.title = title;
        this.limit = limit;
    },
    mounted() {
        this.select = M.FormSelect.init(this.$refs.select);
        M.updateTextFields();
    },
    beforeUnmount() {
        if (this.select && this.select.destroy) {
            this.select.destroy();
        }
    }
}
</script>