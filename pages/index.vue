<template>
    <main>
        <Header />

        <Hero-Home />

        <section class="section" id="features">
            <div class="container">
                <div class="bg-box rounded-[40px] py-20 px-8 flex flex-col gap-12">
                    <h2 class="h2 text-center font-bold">Why choose TruSense?</h2>
                    <div class="grid md:grid-cols-3 gap-5">
                        <CardFeature
                            title="Immutability"
                            description="Storing measurements on Hedera's immutable ledger ensures transparency and verifiability."
                            icon="/icons/hashgraph.svg"
                            :i="0"
                        />
                        <CardFeature
                            data-aos-delay="100"
                            title="Realtime Data"
                            description="TruSense provides charts and dashboards for real-time monitoring of temperature, humidity, and air pressure."
                            icon="/icons/realtime.svg"
                            :i="1"
                        />
                        <CardFeature
                            data-aos-delay="200"
                            title="Smart Alerts"
                            description="Immediately receive an email alert when a measurement exceeds your predefined thresholds."
                            icon="/icons/alert.svg"
                            :i="2"
                        />
                    </div>
                </div>
            </div>
        </section>

        <section class="section" id="industries">
            <div class="container flex flex-col gap-12">
                <h2 class="h2 text-center">Many industries can benefit from TruSense</h2>
                <div class="grid md:grid-cols-12 gap-5">
                    <div class="md:col-span-8 flex flex-col gap-10">
                        <CardIndustry
                            title="Supply chain"
                            description="Monitor temperature-sensitive perishable goods such as coffee, cacao, fish and dairy during storage and transportation."
                            image="/images/industries/logistics.png"
                        />
                        <CardIndustry
                            title="Agriculture & Food Security"
                            description="Transparent and immutable weather condition monitoring for fair crop insurance claims."
                            image="/images/industries/agriculture.png"
                            :reverse="true"
                            :i="0"
                        />
                        <CardIndustry
                            title="Sustainable Cities"
                            description="Verifiably measure the impact of sustainability projects, such as urban tree planting, on temperature and humidity for better allocation of resources for climate change mitigation."
                            image="/images/industries/trees.png"
                            :reverse="false"
                            :i="1"
                        />
                        <CardIndustry
                            title="Data centers"
                            description="Ensure optimal server performance and prevent equipment failure with environmental monitoring."
                            image="/images/industries/data-centers.jpg"
                            :reverse="true"
                            :i="2"
                        />
                        <CardIndustry
                            title="Wine & Spirits Storage"
                            description="Maintain perfect aging conditions for premium wines and spirits with precise control with full transparency to future consumers."
                            image="/images/industries/wine.jpg"
                            :reverse="false"
                            :i="3"
                        />

                        <CardIndustry
                            title="Healthcare"
                            description="Track and verify storage environments for pharmaceuticals and medical devices to safeguard efficacy, prevent spoilage, and reduce waste from previously dispensed but unused medicines."
                            image="/images/industries/healthcare.jpg"
                            :reverse="true"
                            :i="4"
                        />

                        <!-- <CardIndustry
                            title="Air Quality"
                            description="Our devices contain a high-precision BME860 sensor which detects volatile organic compounds in the air. The next generation of TruSense sensors will also allow for real-time monitoring of air quality on Hedera. Many use cases are yet to be imagined, including real-time indoor air quality monitoring in offices and factories; trusted by both workers and employers."
                            image="/images/industries/air-quality2.png"
                            :reverse="false"
                            :i="5"
                        /> -->
                    </div>
                    <div class="md:col-span-4 lg:col-span-3 lg:col-start-10">
                        <div
                            class="bg-box rounded-[40px] p-8 flex flex-col gap-4 sticky top-20 justify-start items-start"
                        >
                            <h4 class="h4 text-primary">Immutable data at your fingertips</h4>

                            <p class="opacity-60">
                                Common use cases require high-precision air measurements every 5-10 minutes. Our sensors
                                can measure and store these measurements on Hedera's decentralized network for only
                                <strong>$1 per month</strong>.
                            </p>

                            <a href="#fees" class="btn">Pricing</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="section" id="fees">
            <div class="container">
                <div class="grid md:grid-cols-12 gap-8">
                    <div class="md:col-span-8 lg:col-span-7 lg:col-start-2 flex flex-col gap-10">
                        <div class="bg-box rounded-[40px] p-8 flex flex-col gap-5">
                            <h2 class="h3">Pricing</h2>

                            <p class="opacity-60 text-lg">
                                Blockchains are often criticized for high transaction fees and their environmental
                                impact. TruSense, however, is powered by the Hedera network — recognized for its low,
                                predictable fees and carbon-negative footprint.
                            </p>

                            <p class="opacity-60 text-lg">
                                Discover the fees for your use cases below and get started with TruSense today!
                            </p>

                            <form class="mt-4">
                                <div class="mb-6 flex gap-5 w-full">
                                    <label htmlFor="sensors" class="block w-40">Sensors:</label>
                                    <div class="flex items-center gap-3 flex-grow">
                                        <input
                                            id="sensors"
                                            type="range"
                                            min="1"
                                            max="100"
                                            v-model="numSensors"
                                            class="slider"
                                        />
                                        <span class="w-16 font-semibold">{{ numSensors }}</span>
                                    </div>
                                </div>

                                <div class="mb-8 flex w-full gap-5">
                                    <label htmlFor="interval" class="block w-40">Measurement Interval:</label>
                                    <div class="flex flex-grow items-center gap-3">
                                        <input
                                            id="interval"
                                            type="range"
                                            v-model="interval"
                                            min="1"
                                            max="1200"
                                            step="1"
                                            class="slider"
                                        />
                                        <span class="w-16 font-semibold">
                                            {{ interval }} <span class="font-light text-xs opacity-60">s</span>
                                        </span>
                                    </div>
                                </div>

                                <div class="mb-8 flex w-full gap-2">
                                    <!-- Current fees -->
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="tariff"
                                            :value="0.0001"
                                            v-model="selectedTariff"
                                            class="w-5 h-5 accent-accent cursor-pointer"
                                        />
                                        <span class="whitespace-nowrap">Current fees</span>
                                    </label>

                                    <!-- Future fees -->
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="tariff"
                                            :value="0.0008"
                                            v-model="selectedTariff"
                                            class="w-5 h-5 accent-accent cursor-pointer"
                                        />
                                        <span class="whitespace-nowrap"> Future fees*</span>
                                    </label>
                                </div>

                                <div class="text-sm">
                                    <span class="opacity-60"
                                        >*Starting January 2026, the price for the ConsensusSubmitMessage transaction on
                                        the Hedera Consensus Service will increase from $0.0001 to $0.0008 USD.
                                    </span>
                                    <a
                                        href="https://hedera.com/blog/price-update-to-consensussubmitmessage-in-consensus-service-january-2026"
                                        target="_blank"
                                        >Read more</a
                                    >
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="md:col-span-4 lg:col-span-3 lg:col-start-9 flex flex-col gap-10">
                        <div class="bg-box rounded-[40px] py-8 px-8 flex flex-col gap-5 items-start">
                            <h2 class="h2 font-bold">${{ fee }} <span class="opacity-60 text-base">/month*</span></h2>

                            <ul class="flex flex-col gap-2">
                                <li>
                                    🔢 {{ numSensors }} high precision sensor<span v-if="numSensors > 1">s</span>
                                    (BME860)
                                    <ul class="ml-4">
                                        <li>🌡️ Temperature</li>
                                        <li>💦 Humidity</li>
                                        <li>🌬️ Air Pressure</li>
                                    </ul>
                                </li>

                                <li>
                                    🕒
                                    <span v-if="interval >= 60">
                                        {{ Math.ceil((interval / 60) * 100) / 100 }} minute
                                    </span>
                                    <span v-else> {{ interval }} second</span> measurement interval
                                </li>
                                <li>🌐 Decentralized storage</li>
                                <li>📈 Realtime charts</li>
                                <li>🚨 Email alerts</li>
                            </ul>

                            <NuxtLink to="/register" class="btn">Get started</NuxtLink>

                            <p class="text-sm opacity-60">
                                * Excluding the initial one-time cost for the device<span v-if="numSensors > 1">s</span>
                                and shipping.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <Footer />
    </main>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
const numSensors = ref(1);
const interval = ref(600);
const fee = ref(null);
const selectedTariff = ref(0.0001);
const truSenseFee = ref(0.0001);

const secondsPerMonth = 30.5 * 24 * 60 * 60;

onMounted(() => {
    fee.value = numSensors.value * (selectedTariff.value + truSenseFee.value) * (secondsPerMonth / interval.value);
    // fee.value = Math.ceil(fee.value * 10) / 10;
    fee.value = fee.value.toFixed(2);
});

watch([numSensors, interval, selectedTariff], ([newNumSensors, newInterval, newSelectedTariff]) => {
    selectedTariff.value = newSelectedTariff;
    fee.value = newNumSensors * (selectedTariff.value + truSenseFee.value) * (secondsPerMonth / newInterval);
    // fee.value = Math.ceil(fee.value * 10) / 10;
    fee.value = fee.value.toFixed(2);
});

useHead({
    title: "TruSense",
});
</script>
