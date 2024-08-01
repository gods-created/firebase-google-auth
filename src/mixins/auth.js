import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, updateProfile, setPersistence, browserLocalPersistence } from "firebase/auth";

export default {
  data() {
    return {
      app: null,
      st_repsonse_json: {
        status: 'error',
        err_description: ''
      }
    }
  },
  async created() {
    const firebaseConfig = this.$store.getters.getFirebaseConfig;
    this.app = initializeApp(firebaseConfig);

    const auth = getAuth();
    await setPersistence(auth, browserLocalPersistence);
  },
  methods: {
    logout() {
      localStorage.clear();
      return this.$router.push({name: 'auth'});
    },

    async ifUserAuth(page='auth') {
      const user = localStorage.getItem('user');
      if (page === 'auth') {
        if (user !== null) {
          return this.$router.push({name: 'dashboard'})
        }
      } else if (page === 'dashboard') {
        if (user === null) {
          return this.$router.push({name: 'auth'})
        } else {
          return JSON.parse(user);
        }
      }

      return;
    },

    async googleAuth() {
      const response_json = { ...this.st_repsonse_json };

      const auth = getAuth();
      auth.languageCode = 'en';

      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

      try {
        const startSignInWithPopup = await signInWithPopup(auth, provider);
        const user = await startSignInWithPopup.user;

        response_json.user = user;
        response_json.status = 'success';

      } catch (error) {
        response_json.err_description = error.message;
      }

      return response_json
    },

    async updateUserData(user, displayName) {
      const response_json = { ...this.st_repsonse_json };

      const auth = getAuth();
      auth.languageCode = 'en';

      try {
        await updateProfile(auth.currentUser, {
          displayName: displayName
        });

        localStorage.setItem('user', JSON.stringify(user));
        response_json.status = 'success';

      } catch (error) {
        response_json.err_description = error.message;
      }

      return response_json
    } 
  }
}