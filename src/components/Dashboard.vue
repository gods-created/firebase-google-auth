<template>
  <v-main>
    <v-alert class="position-fixed w-100 rounded-0"
      v-if="alert.state"
      color="red"
      :text="alert.text"
    >

    </v-alert>

    <v-layout class="d-flex align-center justify-center w-100" style="height: 100vh;">
      <v-sheet class="mx-auto" width="300">
        <v-form>
          <v-text-field
            v-model="user.displayName"
            :rules="user.rules"
            label="Display name"
          ></v-text-field>
          <v-btn class="mt-2" type="submit" :disabled="formButton.state" :loading="formButton.state" @click.prevent="launchUpdateUserData" block>Update</v-btn>
          <v-btn color="red" class="mt-2" type="submit" block @click.prevent="logout">Logout</v-btn>
        </v-form>
      </v-sheet>
    </v-layout>
  </v-main>
</template>

<script>
  import logout from '@/mixins/auth.js';
  import ifUserAuth from '@/mixins/auth.js';
  import updateUserData from '@/mixins/auth.js';

  export default {
    name: 'DashboardView',
    data () {
      return {
        user: null,
        formButton: {
          state: false
        },

        alert: {
          state: false,
          text: ''
        }
      }
    },
    mixins: [
      ifUserAuth,
      logout,
      updateUserData,
    ],
    async mounted() {
      const currentRouteName = this.$router.currentRoute._value.name;
      const user = await this.ifUserAuth(currentRouteName);
      user.rules = [
        v => !!v || 'Can\'t to be empty!'
      ];

      this.user = user;
    },
    methods: {
      launchLogout() {
        return this.logout();
      },

      async launchUpdateUserData() {
        const alert = this.alert;
        const formButton = this.formButton;

        alert.state = false;
        
        const user = this.user;
        const displayName = user.displayName;
        if (displayName.replaceAll(' ', '').length === 0) {
          return;
        } 

        formButton.state = true;

        try {
          const request = await this.updateUserData(user, displayName);
          const { status, err_description } = request;
          if (status === 'error') {
            alert.text = err_description;
          }
        } catch (error) {
          const err_description = error.message;
          alert.text = err_description;
        }

        formButton.state = false;
        if (alert.text.replaceAll(' ', '').length !== 0) {
          alert.state = true;
        } 

        return;
      },
    }
  }
</script>
