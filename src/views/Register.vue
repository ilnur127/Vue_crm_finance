<template>
    <form 
        class="card auth-card"
        @submit.prevent="submitForm"
    >
        <div class="card-content">
            <span class="card-title">Домашняя бухгалтерия</span>
            <div class="input-field">
                <input
                    id="email"
                    type="text"
                    v-model="email"
                    :class="{invalidInput: errorEmail}"
                    @change="checkEmail"
                >
                <label for="email">Email</label>
                <small v-if="errorEmail" class="helper-text invalid">Поле Email не должно быть пустым</small>
            </div>
            <div class="input-field">
                <input
                    id="password"
                    type="password"
                    class="validate"
                    v-model="password"
                    :class="{invalidInput: errorPassword}"
                    @input="checkPassword"
                >
                <label for="password">Пароль</label>
                <small v-if="errorPassword" class="helper-text invalid">Пароль должен быть больше 6-ти символов. Сейчас он {{password.length}}</small>
            </div>
            <div class="input-field">
                <input
                    id="name"
                    type="text"
                    class="validate"
                    v-model="fio"
                    :class="{invalidInput: errorFIO}"
                    @change="checkFIO"
                >
                <label for="name">Имя</label>
                <small v-if="errorFIO" class="helper-text invalid">Поле Name не должно быть пустым</small>
            </div>
            <p>
                <label>
                    <input 
                        type="checkbox"
                        v-model="rules"
                        @change="checkRules"
                    />
                    <span :class="{invalid: errorRules}">С правилами согласен</span>
                </label>
            </p>
        </div>
        <div class="card-action">
            <div>
                <button
                    class="btn waves-effect waves-light auth-submit"
                    type="submit"
                >
                    Зарегистрироваться
                    <i class="material-icons right">send</i>
                </button>
            </div>

            <p class="center">
                Уже есть аккаунт?
                <a href="/login">Войти!</a>
            </p>
        </div>
    </form>
</template>

<script>
export default {
    name: 'register',
    data: () => ({
        email: '',
        password: '',
        fio:'',
        rules: false,
        errorEmail: false,
        errorPassword: false,
        errorFIO: false,
        errorRules: false,
        errorForm: true,
    }),
    methods: {
        checkEmail(){
            if(this.email == ''){
                this.errorEmail = true;
            } else {
                this.errorEmail = false;
            }
        },
        checkPassword(){
            if(this.password.length < 6){
                this.errorPassword = true;
            } else {
                this.errorPassword = false;
            }
        },
        checkFIO(){
            if(this.fio == ''){
                this.errorFIO = true;
            } else {
                this.errorFIO = false;
            }
        },
        checkRules(){
            if(!this.rules){
                this.errorRules = true;
            } else {
                this.errorRules = false;
            }
        },
        async submitForm(){
            this.checkEmail();
            this.checkPassword();
            this.checkFIO();
            this.checkRules();
            if (this.errorEmail || this.errorPassword || this.errorFIO || this.errorRules) {
                return
            }
            const formData = {
                email: this.email,
                password: this.password,
                name: this.fio
            }

            try{
                await this.$store.dispatch('register', formData);
                this.$router.push('/');
            } catch (e) {
                return;
            }
        }
    }
}
</script>

<style scoped>
.invalid {
    color:#f44336;
}
.invalidInput{
    border-bottom: 2px solid #f44336 !important;
}
</style>