<template>
    <main>
        <Header />
        <HeroSensor v-if="topicId" :name="name" :interval="interval" :topicId="topicId" />

        <!-- <div class="btn" @click="updateInterval(40000)">Set interval (40000)</div> -->

        <section class="section">
            <div class="container flex flex-col gap-10">
                <CurrentMeasurements v-if="topicId" :topicId="topicId" :interval="interval" />

                <!-- <div class="grid sm:grid-cols-3 gap-5">
                    <div class="bg-box rounded-[40px] p-8">
                        <h3>Alerts</h3>
                    </div>
                </div> -->

                <Chart v-if="topicId" :topicId="topicId" :interval="interval" />
                <div v-else>
                    <p>Loading chart...</p>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
import { onMounted } from "vue";
import CurrentMeasurements from "../../components/CurrentMeasurements.vue";

// get slug
const route = useRoute();
const slug = route.params.slug;

const topicId = ref(null);
const interval = ref(null);
const name = ref(null);
const pageTitle = ref("Loading...");

// get the sensor for db on mount
onMounted(async () => {
    try {
        const sensor = await $fetch("/api/sensors/" + slug);
        topicId.value = sensor.topicId;
        interval.value = sensor.interval;
        name.value = sensor.name;
        pageTitle.value = sensor.name;
    } catch (error) {
        console.log(error);
    }
});

async function updateInterval(interval) {
    if (!topicId.value) return;

    console.log("updating interval");
    interval = 30000;

    await fetch("https://trusense-web-server.onrender.com/settings/" + topicId.value, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ interval }),
    })
        .then(async (response) => {
            if (!response.ok) {
                console.error("Failed to update interval");
                return;
            }

            console.log("Successfully updated settings for sensor", topicId.value);

            const data = await response.json();

            if (interval === +data.received.interval) {
                // update database
                try {
                    await $fetch("/api/sensors/" + slug, {
                        method: "PATCH",
                        body: { interval },
                    });
                    console.log("Successfully updated database for sensor", topicId.value);
                } catch (error) {
                    console.error("Failed to update interval:", error);
                }
            } else {
                console.error("Interval not equal to received interval");
            }
        })
        .catch((error) => {
            console.error("Error sending interval:", error);
        });
}

useHead({
    title: pageTitle,
});
</script>
