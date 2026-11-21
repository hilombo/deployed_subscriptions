<template>
    <div class="app">
        <Navbar />
        <div class="row justify-content-center">
            <div class="col-md-5">
                <div v-if="!isUpdate">
                    <h3 class="text-center">Add Subscription</h3>
                </div>
                <div v-if="isUpdate">
                    <h3 class="text-center">Edit Subscription</h3>
                </div>
                <form @submit.prevent="onFormSubmit">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" class="form-control" v-model="subscription.name" required>
                    </div>

                    <div class="form-group">
                        <label>Description</label>
                        <input type="text" class="form-control" v-model="subscription.description" required>
                    </div>
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="date" class="form-control" v-model="subscription.startDate" required>
                    </div>
                    <br>
                    <div class="form-group">
                        <label>Amount</label>
                        <input type="text" class="form-control" v-model="subscription.amount" required>
                    </div>
                    <div class="form-group">
                        <label>Payment Frequency</label>
                        <select id='frequency' class="form-control" v-model="subscription.frequency" required>
                            <option value='weekly'>Weekly</option>
                            <option value='bimonthly'>Bi-monthly</option>
                            <option value='monthly'>Monthly</option>
                            <option value='quarterly'>Quarterly</option>
                            <option value='biannually'>Bi-annually</option>
                            <option value='annually'>Annually</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <button v-if="!isUpdate" type="submit" class="btn btn-primary col-4">Save</button>
                        <button v-if="isUpdate" type="submit" class="btn btn-primary btn-block">Update</button>
                        <button type="button" class="btn btn-primary col-4" @click="cancelOperation">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>

import db from '../firebaseDb'
import Navbar from '../components//Navbar.vue'
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore'
const subsCollectionRef = collection(db, 'subscriptions') // Database collection reference
import { useUserStore } from '@/stores/user'

export default {
    name: 'CreateUpdate',
    components: {
        Navbar
    },
    data() {
        return {
            subscription: {},
            isUpdate: false,
            user: ''
        }
    },
    created() {
        const userStore = useUserStore()
        this.user = userStore.getUser();
        if (this.$route.params.id) {
            this.isUpdate = true;
            //populate the subscription record to be edited
            const docSnap = this.getRecord(this.$route.params.id)
        }
        else {
            this.isUpdate = false;
        }
    },
    mounted() {
 
        if (this.$route.params.id) {
            this.subscription = {};
            this.isUpdate = true;
        }
        else {
            this.isUpdate = false;
        }
    },
    methods: {
        async getRecord(id) {
            let docRef = doc(subsCollectionRef, id);
            try {
                const docSnap = await getDoc(docRef);
 
                const data = docSnap.data();
                this.subscription.name = data.name;
                this.subscription.description = data.description;
                this.subscription.startDate = data.startDate ?? '';
                this.subscription.frequency = data.frequency;
                this.subscription.username = data.username;
                this.subscription.amount = data.amount;

            } catch (error) {
                console.log(error)
            }
        },
        addSubscription() {
            if (this.subscription.name.length !== 0 &&
                this.subscription.description.length !== 0) {
                this.subscription.username = this.user; // save with username
                addDoc(subsCollectionRef, this.subscription).then(() => {
                    this.subscription.name = ''
                    this.subscription.description = ''
                    this.subscription.startDate = ''
                    this.subscription.amount = ''
                    this.subscription.frequency = ''
                    this.subscription.username = ''
                    this.$router.push('/subscriptionsList')
                })
                this.error = true;
                this.errorMsg = "Please fill out the subscription name and description"
                setTimeout(() => {
                    this.error = false;
                }, 5000)
            }
        },
        cancelOperation() {
            this.$router.push('/subscriptionsList')
        },
        onFormSubmit() {
            if (this.isUpdate) {
                this.updateSubscription()
            } else {
                this.addSubscription()
            }
        },
        updateSubscription() {
            updateDoc(doc(subsCollectionRef, this.$route.params.id), this.subscription).then(() => {
                this.$router.push('/subscriptionsList')
            }).catch((error) => {
                console.log(error)
                alert('Error updating subscription');
                this.$router.push('/subscriptionsList')
            })
        },
    }
}
</script>
