<template>
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Сумма</th>
                <th>Дата</th>
                <th>Категория</th>
                <th>Тип</th>
                <th>Открыть</th>
            </tr>
        </thead>

        <tbody>
            <tr 
                v-for="(record, indx) of records"
                :key="record.id"
            >
                <td>{{indx + 1}}</td>
                <td>{{getCurrency(record.amount)}}</td>
                <td>{{$filters.dateFilter(record.date, 'datetime')}}</td>
                <td>{{record.categoryName}}</td>
                <td>
                    <span 
                        class="white-text badge"
                        :class="[record.typeClass]"
                    >{{record.typeText}}</span>
                </td>
                <td>
                    <button 
                        class="btn-small btn"
                        @click="$router.push('/detail/' + record.id)"
                        v-tooltip="`Открыть запись №${indx + 1}`"
                    >
                        <i class="material-icons">open_in_new</i>
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default {
    props:{
        records: {
            required: true,
            type: Array
        }
    },
    methods:{
        getCurrency(cur) {
            return new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB'
            }).format(cur)
        }
    }
}
</script>