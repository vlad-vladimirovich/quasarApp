<template>
  <q-page class="bg-grey-3 column">
    <div class="row q-pa-sm bg-primary">
      <q-input
        v-model="newTask"
        @keyup.enter="addNewTask"
        class="col"
        square
        filled
        bg-color="white"
        label="Добавить задачу" 
        dense
      >
        <template v-slot:append>
          <q-btn
            @click="addNewTask"
            round 
            dense 
            flat 
            icon="add" 
          />
        </template>
      </q-input>
    </div>
    <q-list>
      <q-item
        v-for="(task, index) in task_list"
        :key="task.title"
        @click="task.is_done = !task.is_done"
        :class="{ 'is_done bg-blue-1' : task.is_done }"
        clickable
        v-ripple
      >
        <q-item-section avatar>
          <q-checkbox
            v-model="task.is_done"
            class="no-pointer-events"
            color="primary"
          />
        </q-item-section>
        
        <q-item-section>
          <q-item-label>{{ task.title }}</q-item-label>
        </q-item-section>
        
        <q-item-section avatar
          v-if="task.is_done"
          slide
        >
          <q-item-label>
            <q-btn
              @click.stop="deleteTask(index)"
              padding="xs"
              flat 
              dense 
              color="primary" 
              icon="delete"
            />
          </q-item-label>
        </q-item-section>

      </q-item>
    </q-list>
    <div v-if="!task_list?.length" class="tasks-completed absolute-center">
      <q-icon name="check" size="100px" color="primary"/>
      <div class="text-h5 text-primary">Нет задач</div>
    </div>
  </q-page>
</template>

<script>
import axios from 'axios';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage',

  data () {
    return {
      newTask: '',
      task_list: []
    }
  },

  methods: {
    async getData() {

      const responce = await axios({
        url: 'http://localhost:3000/api/records', 
        method: 'get'});
      
      responce.data.forEach((item) => this.task_list.push({
        title: item['task_descr'],
        is_done: item['task_state']})
      ),

      console.log(this.task_list);

    },
    async addNewTask() {
      await axios({
        url: 'http://localhost:3000/api/records', 
        method: 'post',
        data: {
          task_descr: this.newTask,
          task_state: false
        }}
      );
      this.newTask = '';
    },

    deleteTask(index) {
      this.$q.dialog({
        title: 'Подтверждение удаления',
        message: 'Вы действительно хотите удалить задачу?',
        cancel: true,
        persistent: true
      }).onOk(() => {

        this.task_list.splice(index, 1)
        this.$q.notify('Задание успешно удалено')
      })
    },
  },
  mounted() {
    this.getData()
  },
})
</script>

<style lang="scss">

  .is_done {
    .q-item__label {
      text-decoration: line-through;
      color: #bbb;
    }
  }

  .tasks-completed {
    opacity: 0.5;
  }

</style>