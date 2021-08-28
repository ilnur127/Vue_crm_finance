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
                    v-model="password"
                    :class="{invalidInput: errorPassword}"
                    @input="checkPassword"
                >
                <label for="password">Пароль</label>
                <small v-if="errorPassword" class="helper-text invalid">Пароль должен быть больше 6-ти символов. Сейчас он {{password.length}}</small>
            </div>
        </div>
        <div class="card-action">
            <div>
                <button
                    class="btn waves-effect waves-light auth-submit"
                    type="submit"
                >
                    Войти
                    <i class="material-icons right">send</i>
                </button>
            </div>

            <p class="center">
                Нет аккаунта?
                <router-link to="/register">Зарегистрироваться</router-link>
            </p>
        </div>
    </form>
</template>

<script>
import messages from '../utils/messages'
export default {
    name: 'login',
    data: () => ({
        email: '',
        password: '',
        errorEmail: false,
        errorPassword: false,
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
        async submitForm(){
            this.checkEmail();
            this.checkPassword();
            if (this.errorEmail || this.errorPassword) {
                return
            }
            const formData = {
                email: this.email,
                password: this.password,
            }
            try {
                await this.$store.dispatch('login', formData);
                this.$router.push('/');
            } catch {
                return;
            }
        }
    },
    mounted() {
        if (messages[this.$route.query.message]) {
            this.$message(messages[this.$route.query.message]);
        }
    }
}
</script>

<style scoped>
.invalidInput{
    border-bottom: 2px solid #f44336 !important;
}
</style>