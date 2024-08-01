<template>
  <v-main>
    <v-alert class="position-fixed w-100 rounded-0"
      v-if="alert.state"
      color="red"
      :text="alert.text"
    >

    </v-alert>

    <v-form class="w-100 d-flex align-center justify-center" style="height: 100vh;">
      <v-btn color="green" @click.prevent="launchGoogleAuth" :disabled="formButton.state" :loading="formButton.state"> 
        <v-icon
          icon="mdi-google"
          center
        ></v-icon>
        <v-tooltip
          activator="parent"
          location="end"
        >Auth using google</v-tooltip>
      </v-btn>
    </v-form>
  </v-main>
</template>

<script>
  import googleAuth from '@/mixins/auth.js';
  import ifUserAuth from '@/mixins/auth.js';

  export default {
    name: 'AuthView',
    mixins: [
      googleAuth,
      ifUserAuth
    ],
    data() {
      return {
        formButton: {
          state: false
        },

        alert: {
          state: false,
          text: ''
        }
      }
    },
    async mounted() {
      const currentRouteName = this.$router.currentRoute._value.name;
      await this.ifUserAuth(currentRouteName);
    },
    methods: {
      async launchGoogleAuth() {
        const alert = this.alert;
        const formButton = this.formButton;

        formButton.state = true;
        alert.state = false;
        
        try {
          const request = await this.googleAuth();
          const { status, err_description, user, auth } = request;
          if (status === 'success') {
            localStorage.setItem('user', JSON.stringify(user));
            return this.$router.push({name: 'dashboard'})
          } else {
            alert.text = err_description;
          }
        } catch (error) {
          const err_description = error.message;
          alert.text = err_description;
        }

        formButton.state = false;
        alert.state = true;
        return;
      },
    }
  }
</script>
