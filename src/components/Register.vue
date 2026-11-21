<template>
    <div class="app">
        <Navbar />
        <form @submit.prevent="register">
            <h2>Register</h2>
            <br>
            <label for="email">Username:</label>
            <input type="email" id="email" placeholder="Email address..." v-model="email" />
            <br><br>
            <label for="pw">Password:</label>
            <input id="pw" type="password" placeholder="password..." v-model="password" />
            <br><br>
            <div class="form-group">
                <button type="submit">Register</button>
                <button @click="cancelOperation">Back to Login</button>
            </div>

        </form>
    </div>
</template>
<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Navbar from '../components//Navbar.vue'
import { auth } from '../firebaseDb'

export default {
    name: 'Register',
    components: {
        Navbar
    },
    data() {
        return {
            email: '',
            password: '',
        };
    },
    methods: {
        async register() {
            try {
                const auth = getAuth();
                await createUserWithEmailAndPassword(auth, this.email, this.password);
                alert("Successfully registered! Please login.");
                this.$router.push("/");
            } catch (error) {
                console.log(error.code, error.message);
                alert(error.code);
            }
        },
        cancelOperation() {
            this.$router.push('/')
        },
    },
};
</script>
