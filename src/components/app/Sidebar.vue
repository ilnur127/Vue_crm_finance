<template>
    <ul 
        v-if="isOpen"
        class="sidenav app-sidenav open">
            <router-link
            v-for="link of getLinks"
            :key="link.url"
            :to="link.url"
            custom
            v-slot="{ href, navigate, isExactActive }"
            >
                <li>
                    <a :href="href" 
                        :class="{'active': isExactActive, 'waves-effect': true, 'waves-orange': true, 'pointer': true}"
                        @click="navigate">{{link.title}}</a>
                </li>
            </router-link>
    </ul>
</template>

<script>
export default {
    data: () => ({
        links: []
    }),
    computed: {
        getLinks(){
            return [
                    {
                        title: this.$filters.localizeFilter('Menu_Bill'),
                        url: '/'
                    },
                    {
                        title: this.$filters.localizeFilter('Menu_History'),
                        url: '/history'
                    },
                    {
                        title: this.$filters.localizeFilter('Menu_Planning'),
                        url: '/planning'
                    },
                    {
                        title: this.$filters.localizeFilter('Menu_Record'),
                        url: '/record'
                    },
                    {
                        title: this.$filters.localizeFilter('Menu_Categories'),
                        url: '/categories'
                    }
                ]; 
            }
    },
    props:['isOpen']
}
</script>

<style scoped>
.active{
    background-color: rgba(0,0,0,0.05);
}
</style>