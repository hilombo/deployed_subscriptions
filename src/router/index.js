import Login from '../components/Login.vue';
import SubscriptionsList from '../components/SubscriptionsList.vue';
import CreateUpdate from '../components/CreateUpdate.vue';
import Register from '../components/Register.vue';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
    },
    {
        path: '/subscriptionsList',
        name: 'SubscriptionsList',
        component: SubscriptionsList,
        meta: {
            authRequired: true,
        },
    },
    {
        path: '/edit/:id',
        name: 'edit',
        component: CreateUpdate,
        meta: {
            authRequired: true,
        },
    },
    {
        path: '/create',
        name: 'create',
        component: CreateUpdate,
        meta: {
            authRequired: true,
        },
    },
];
// Create the router instance
const router = createRouter({
    history: createWebHistory(),
    routes
})
// Helper function to get the current user, waiting for Firebase to initialize if necessary
function getCurrentUser() {
  const auth = getAuth();
  return new Promise((resolve) => {
    // If already known, return immediately
    if (auth.currentUser) {
      resolve(auth.currentUser);
      return;
    }
    // Otherwise wait for Firebase to finish initializing
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();       // ✅ IMPORTANT: remove listener
      resolve(user);
    });
  });
}
// Navigation guard to protect routes that require authentication
router.beforeEach(async (to, from, next) => {
  // Only protect routes that explicitly require auth
  if (to.matched.some((record) => record.meta.authRequired)) {
    const user = await getCurrentUser();
    if (user) next();
    else next({ path: "/" }); // ✅ redirect to login without alert
  } else {
    next();
  }
});
export default router;
