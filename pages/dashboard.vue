<template>
    <main>
        <Header />

        <section class="section">
            <div class="container pt-10">
                <div class="grid md:grid-cols-12 gap-5">
                    <div class="md:col-span-10 lg:col-span-8 md:col-start-2 lg:col-start-3 flex flex-col gap-8">
                        <h2 class="h2 text-center">Your sensors</h2>
                        <div class="flex gap-5 flex-wrap md:flex-nowrap">
                            <input
                                v-model="searchText"
                                type="text"
                                class="!bg-white order-3 md:order-2"
                                placeholder="Search..."
                            />

                            <!-- <NuxtLink to="/order" class="btn gap-3 order-2 md:order-3">
                                <span
                                    class="flex justify-center items-center size-6 bg-black text-white rounded-full -ml-3 text-primary"
                                    >+</span
                                >
                                New sensor
                            </NuxtLink> -->
                        </div>

                        <!-- list all sensors -->
                        <div class="flex flex-col gap-5" v-if="sensors">
                            <CardSensorMini
                                v-for="sensor in sensors"
                                :key="sensor.id"
                                v-bind="sensor"
                                :link="`/sensor/${sensor.id}`"
                            />

                            <div v-if="sensors.length === 0" class="bg-box p-8 rounded-[40px]">
                                <p>No sensors found</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
import { ref, onMounted } from "vue";

useHead({
    title: "Dashboard - TruSense",
});

const searchText = ref("");

const { user, loading, error, isLoggedIn, fetchUser } = useAuth();
await fetchUser();

const { data: sensors, refresh } = await useFetch("/api/sensors/search", {
    query: { q: searchText, userId: user.value.id },
});
</script>
