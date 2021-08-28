<template>
    <div>
        <div class="page-title">
            <h3>{{$filters.localizeFilter('ProfileTitle')}}</h3>
        </div>
        <form 
            class="form"
            @submit.prevent="submitForm"
        >
            <div class="input-field">
                <input
                    id="description"
                    type="text"
                    v-model="name"
                >
                <label for="description">{{$filters.localizeFilter('Name')}}</label>
                <span v-if="errorName" class="helper-text invalid">{{$filters.localizeFilter('Message_Entername')}}</span>
            </div>
            <div class="input-field">
                <input
                    id="description"
                    type="text"
                    v-model="bill"
                >
                <label for="description">{{$filters.localizeFilter('Bill')}}</label>
                <span v-if="errorBill" class="helper-text invalid">{{$filters.localizeFilter('Message_Enterbill')}}</span>
            </div>
            <div class="switch">
                <label>
                    English
                    <input 
                        type="checkbox"
                        v-model="isEnLocale"
                    >
                    <span class="lever"></span>
                </label>
            </div>

            <button class="btn waves-effect waves-light" type="submit">
                {{$filters.localizeFilter('Update')}}
                <i class="material-icons right">send</i>
            </button>
        </form>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import M from 'materialize-css'
export default {
    name: 'profile',
    data: () => ({
        name: '',
        bill: 0,
        errorName: false,
        errorBill: false,
        isEnLocale: false,
    }),
    mounted(){
        this.name = this.info.name;
        this.bill = this.info.bill;
        this.isEnLocale = this.info.locale === "ru-Ru" ? false : true
        setTimeout(()=>{
            M.updateTextFields();
        });
    },
    computed: {
        ...mapGetters(['info'])
    },
    methods: {
        ...mapActions(['updateInfo']),
        checkName(){
            if(this.name == ''){
                this.errorName = true;
            } else {
                this.errorName = false;
            }
        },
        checkBill(){
            if(this.name == ''){
                this.errorBill = true;
            } else {
                this.errorBill = false;
            }
        },
        async submitForm(){
            this.checkName();
            this.checkBill();

            if(this.errorBill || this.errorName){
                return false;
            }

            try {
                await this.updateInfo({
                    name: this.name,
                    bill: this.bill,
                    locale: this.isEnLocale ? 'en-Us' : 'ru-Ru'
                });
                this.$message('Данные успешно обновлены');
            } catch (e) {
                console.log(e);
                this.$error('Данные необновлены');
            }
        }
    }
}
</script>

<style scoped>
    .switch {
        margin-bottom: 2rem;
    }
</style>