<template>
    <div class="app">
        <Navbar />
        <form @submit.prevent="login">
            <h2>Login</h2>
            <br>
            <label for="email">Username:</label>
            <input type="email" id="email" placeholder="Email address..." v-model="email" />
            <br><br>
            <label for="pw">Password:</label>
            <input id="pw" type="password" placeholder="password..." v-model="password" />
            <br><br>
            <button type="submit">Login</button>
            <p>
               <br> <a href="#" @click.prevent="showResetPopup = true">Forgot Password?</a>
            </p>

            <p v-if="message" :class="isError ? 'error' : 'success'">{{ message }}</p>

        </form>
        <!-- Password Reset Popup - firebase password reset feature -->
        <div v-if="showResetPopup" class="popup-overlay">
            <div class="popup-content">
                <h3>Reset Password</h3>
                <input type="email" placeholder="Enter your email" v-model="resetEmail" required />
                <button @click="handlePasswordReset">Send Reset Email</button>
                <button @click="closePopup">Close</button>
                <p v-if="resetMessage" :class="isResetError ? 'error' : 'success'">{{ resetMessage }}</p>
            </div>
        </div>
    </div>
</template>
<script>
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import Navbar from '../components//Navbar.vue'
import { useUserStore } from "../stores/user";
const APP_URL = "http://localhost:5173"; // Update this to your actual app URL
export default {
    name: 'Login',
    components: {
        Navbar
    },
    data() {
        return {
            email: '',
            password: '',
            resetEmail: '',
            showResetPopup: false,
            resetMessage: '',
            isResetError: false,
            message: false,
            isError: false,
        }
    },
    methods: {
        // Firebase authentication for login
        login() {
            const userStore = useUserStore()
            const auth = getAuth();
            signInWithEmailAndPassword(auth, this.email, this.password)
                .then(() => {
                    userStore.setUser(this.email);
                    this.$router.push('/subscriptionsList');
                })
                .catch(error => {
                    alert(error.message);
                });
        },
        // Firebase password reset functionality
        async handlePasswordReset() {
            if (!this.resetEmail) {
                this.isResetError = true;
                this.resetMessage = 'Please enter your email address.';
                return;
            }
            try {
                const auth = getAuth();
                const actionCodeSettings = {
                    url: APP_URL, // where user should return after reset
                    handleCodeInApp: false,  // default; reset handled by firebase
                };
                await sendPasswordResetEmail(auth, this.resetEmail, actionCodeSettings);
                this.isResetError = false;
                this.resetMessage = 'Password reset email sent! Check your inbox.';
                // Close popup after 2 seconds
                setTimeout(() => {
                    this.showResetPopup = false;
                    this.resetEmail = '';
                    this.resetMessage = '';
                }, 2000);
            } catch (error) {
                this.isResetError = true;
                this.resetMessage = error.message;
            }
        },
        // Close the password reset popup and clear related data
        closePopup() {
            this.showResetPopup = false;
            this.resetEmail = '';
            this.resetMessage = '';
            this.isResetError = false;
        }
    },
};
</script>
<style scoped>
/* Basic styling for the popup - 
you can use a library like Tailwind or Bootstrap for better styling */
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
}

.error {
    color: red;
}

.success {
    color: green;
}
</style>

