<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <div class="q-px-lg q-pt-xl q-mb-md" style="height: 150px;">
          <div class="text-h3">TODO list</div>
          <div class="text-subtitle1">{{ format_date }}</div>
        </div>

        <q-img src="grass.jpg" class="header-image absolute-top"/>

      </q-toolbar>
    </q-header>

    <q-drawer
        v-model="leftMenuOpener"
        show-if-above
        :width="300"
        :breakpoint="900"
      >
        <q-scroll-area style="height: calc(100% - 166px); margin-top: 166px; border-right: 1px solid #ddd">
          <q-list padding>
            <q-item to='/' exact clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="list" />
              </q-item-section>

              <q-item-section>
                TODO
              </q-item-section>
            </q-item>

            <q-item to='/help' exact clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="help" />
              </q-item-section>

              <q-item-section>
                HELP
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img class="menu-image absolute-top" src="grass.jpg" style="height: 166px">
          <div class="absolute-bottom bg-transparent">

            <q-avatar size="70px" class="q-mb-sm">
              <img src="profile_photo.png">
            </q-avatar>

            <div class="text-weight-bold blue-grey-1" style="font-size: 130%;">Владислав Голубков</div>
            <a class="text-weight-bold" href="https://github.com/vlad-vladimirovich" target="_blank" rel="noopener noreferrer">@Follow me on github</a>

          </div>
        </q-img>
      </q-drawer>

    <q-page-container>
      <keep-alive>
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { defaults } from 'autoprefixer';
import { date } from 'quasar';

defineOptions({
  name: 'MainLayout'
})

const menuList = [
  {
    icon: 'inbox',
    label: 'Inbox',
    separator: true
  },
  {
    icon: 'send',
    label: 'Outbox',
    separator: false
  },
  {
    icon: 'delete',
    label: 'Trash',
    separator: false
  },
  {
    icon: 'error',
    label: 'Spam',
    separator: true
  },
  {
    icon: 'settings',
    label: 'Settings',
    separator: false
  },
  {
    icon: 'feedback',
    label: 'Send Feedback',
    separator: false
  },
  {
    icon: 'help',
    iconColor: 'primary',
    label: 'Help',
    separator: false
  }
]

const leftMenuOpener = ref(false)

function toggleLeftDrawer () {
  leftMenuOpener.value = !leftMenuOpener.value
}

let date_today = Date.now()
const format_date = date.formatDate(date_today, 'dddd D MMMM')

</script>

<style lang="scss">
  .header-image {
    height: 100%;
    z-index: -1;
    opacity: 0.5;
  }
</style>