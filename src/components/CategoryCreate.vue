<template>
    <div class="col s12 m6">
        <div class="page-subtitle">
            <h4>Создать</h4>
        </div>

        <form @submit.prevent="submitForm">
            <div class="input-field">
                <input
                    id="nameCreate"
                    type="text"
                    v-model="title"
                    :class="{invalidInput: errorTitle}"
                    @change="checkTitle"
                >
                <label for="nameCreate">Название</label>
                <span v-if="errorTitle" class="helper-text invalid">Введите название категории</span>
            </div>

            <div class="input-field">
                <input
                    id="limitCreate"
                    type="number"
                    v-model.number="limit"
                    :class="{invalidInput: errorLimit}"
                    @change="checkLimit"
                >
                <label for="limitCreate">Лимит</label>
                <span v-if="errorLimit" class="helper-text invalid">Минимальное значение {{minLimit}}</span>
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
export default {
    data:() => ({
        title: '',
        limit: 100,
        minLimit: 100,
        errorTitle: false,
        errorLimit: false,
    }),
    mounted() {
        M.updateTextFields();
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
            if(this.limit < this.minLimit){
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
                title: this.title,
                limit: this.limit,
            }

            try {
                const category = await this.$store.dispatch('createCategory', formData);
                this.$message(`Категория ${this.title} была успешно создана`);
                this.title = '';
                this.limit = 1;
                this.$emit('created',category);
            } catch (e) {
                return;
            }
        }
    }
}
</script>