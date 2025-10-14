<template>
    <main>
        <Header />

        <section class="section mt-20">
            <div class="container flex flex-col gap-8">
                <div class="flex gap-5 flex-wrap md:flex-nowrap">
                    <!-- <div class="flex gap-2 order-1 flex-grow">
                        <div class="btn" :class="{ 'btn--light': !showAll }" @click="handleFilterAll">All</div>
                        <div class="btn" :class="{ 'btn--light': showAll }" @click="handleFilterActive">Active</div>
                    </div> -->

                    <input
                        v-model="searchText"
                        type="text"
                        class="!bg-white order-3 md:order-2"
                        placeholder="Search sensors"
                    />

                    <NuxtLink to="/order" class="btn gap-3 order-2 md:order-3">
                        <span
                            class="flex justify-center items-center size-6 bg-black text-white rounded-full -ml-3 text-primary"
                            >+</span
                        >
                        New sensor
                    </NuxtLink>
                </div>

                <!-- list all sensors -->
                <div class="flex flex-col gap-5">
                    <CardSensorMini v-for="sensor in allSensors" :key="sensor.id" v-bind="sensor" />
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
import { ref } from "vue";

useHead({
    title: "Dashboard - TruSense",
});

const searchText = ref("");
const allSensors = ref([]);

const { user, loading, error, isLoggedIn, fetchUser } = useAuth();

await fetchUser();

console.log("user.value.id :>> ", user.value.id);

if (user.value) {
    try {
        allSensors.value = await $fetch("/api/sensors", {
            query: { subscriberId: user.value.id }, // filtered
        });
    } catch (error) {
        console.error("Failed to fetch sensors:", error);
    }
}
</script>
