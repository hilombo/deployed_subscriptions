<template>
    <nav class="navbar navbar-expand-lg navbar-custom">
        <span class="navbar-brand">Subscriptions</span>
        <ul class="nav justify-content-center">
            <li v-if="loggedIn" class="nav-item">
                <a class="nav-link" @click="logout">Logout</a>
            </li>
            <li v-else class="nav-item active">
                <a class="nav-link" @click="register">Register</a>
            </li>
        </ul>
    </nav>
</template>
<script>
import { getAuth } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../firebaseDb'

export default {
    name: 'Navbar',
    data() {
        return {
            loggedIn: 'false',
            unsubscribeAuth: null,
        }
    },
        beforeUnmount() {
            if (this.unsubscribeAuth) {
                this.unsubscribeAuth(); 
            }
        },  
    mounted() {
        // Reactively track login status
        this.unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            this.loggedIn = !!user;
        });
    },
    methods: {
        async logout() {
            try {
                await signOut(auth);
                this.loggedIn = false;
                this.$router.push("/");
            } catch (error) {
                alert(error.message);
                this.$router.push("/");
            }
        },
        register() {
            this.$router.push('/register')
        },
    },
}
</script>

<style lang="scss">
* {
    margin: 10;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Fira Sans', san-serif;
}

// Set custom nav bar colors
.navbar-brand,
.navbar-text,
.navbar {
    background-color: #44515e;
    padding: .5em;

    span {
        color: #42B883;
    }
}

a {
    color: black;
    padding: .5em;

    &.router-link-exact-active {
        color: #08492c;
    }
}
</style>
