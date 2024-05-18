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
        :key="task.task_text"
        @click="updateTaskState(index, task.task_text)"
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
          <q-item-label>{{ task.task_text }}</q-item-label>
        </q-item-section>
        
        <q-item-section avatar
          v-if="task.is_done"
          slide
        >
          <q-item-label>
            <q-btn
              @click.stop="deleteTask(index, task.task_text)"
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
import { ref, defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage',

  data () {
    return {
      newTask: '',
      task_list: ref([])
    }
  },

  mounted() {
    this.showData()
  },

  methods: {

    // Get data from db
    async getDBD() {
      const responce = await axios({
        url: 'http://localhost:3000/api/records', 
        method: 'get'
      });

      const tasks_from_db = await responce.data;
      return tasks_from_db
    },

    // Get task data from db by text
    async getTaskDataDB (task_text) {
      try {
        const tasks_from_db = await this.getDBD();
        const task_item_data = tasks_from_db.filter(element => element.task_text == task_text);
        return task_item_data[0]

      } catch (err) {
          console.error(err);
      }
    },

    // Prepare data from db
    async showData() {
      if (!this.task_list.length){
        try {
          const tasks_from_db = await this.getDBD();
          
          tasks_from_db.forEach((task) => this.task_list.push({
            task_text: task['task_text'],
            is_done: task['is_done']})
          );

        } catch (err) {
          console.error(err);
        }
      }
    },

    async addNewTask() {
      await axios({
        url: 'http://localhost:3000/api/records', 
        method: 'post',
        data: {
          task_text: this.newTask,
          is_done: false
        }}
      );

      this.task_list.push({task_text: this.newTask, is_done: false});
      this.newTask = '',

      this.$q.notify({message: 'Задание успешно добавлено', color: 'green'});
    },

    async updateTaskState (index, task_text) {
      try{
        const task_db_data = await this.getTaskDataDB(task_text);
        const task_state = task_db_data.is_done;
        const task_id = task_db_data._id;

        this.task_list[index]['is_done'] = !this.task_list[index]['is_done'],

        await axios({ 
          url: `http://localhost:3000/api/records/${task_id}`, 
          method: 'put', 
          data: {
            is_done: !task_state
          }}
        );
                    
      } catch (err) {
        console.error(err);
      }
    },

    async deleteTask(index, task_text) {
      try{
        const task_db_data = await this.getTaskDataDB(task_text);
        const task_id = task_db_data._id;

        this.$q.dialog({
          title: 'Подтверждение удаления',
          message: 'Вы действительно хотите удалить задачу?',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          axios({
            url: `http://localhost:3000/api/records/${task_id}`, 
            method: 'delete'
          })
          .then(this.task_list.splice(index, 1));

          this.$q.notify({message: 'Задание успешно удалено', color: 'red'});
        });

      } catch (err) {
        console.error(err);
      }
    },
  }
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