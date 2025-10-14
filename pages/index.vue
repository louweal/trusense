<template>
    <main>
        <Header />

        <Hero-Home />

        <section class="section" id="features">
            <div class="container">
                <div class="bg-box rounded-[40px] py-20 px-8">
                    <h2 class="text-center">Why choose TruSense?</h2>
                    <div class="grid md:grid-cols-3 gap-5">
                        <div class="flex flex-col gap-4">
                            <h3>Immutable Data</h3>
                        </div>
                        <div class="flex flex-col gap-4">
                            <h3>Realtime Charts</h3>
                        </div>

                        <div class="flex flex-col gap-4">
                            <h3>Smart Alerts</h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="section" id="industries">
            <div class="container">
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
                        />
                        <CardIndustry
                            title="Sustainable Cities"
                            description="Verifiably measure the impact of sustainability projects, such as urban tree planting, on temperature and humidity for better allocation of resources for climate change mitigation."
                            image="/images/industries/trees.png"
                            :reverse="false"
                        />
                        <CardIndustry
                            title="Data centers"
                            description="Ensure optimal server performance and prevent equipment failure with environmental monitoring."
                            image="/images/industries/data-centers.jpg"
                            :reverse="true"
                        />
                        <CardIndustry
                            title="Wine & Spirits Storage"
                            description="Maintain perfect aging conditions for premium wines and spirits with precise control with full transparency to future consumers."
                            image="/images/industries/wine.jpg"
                            :reverse="false"
                        />

                        <CardIndustry
                            title="Healthcare"
                            description="Track and verify storage environments for pharmaceuticals and medical devices to safeguard efficacy, prevent spoilage, and reduce waste from previously dispensed but unused medicines."
                            image="/images/industries/healthcare.jpg"
                            :reverse="true"
                        />

                        <CardIndustry
                            title="Air Quality"
                            description="The BME860 detects volatile organic compounds in the air. The next generation of TruSense sensors will also allow for real-time monitoring of air quality on Hedera. Many use cases are yet to be imagined, including real-time indoor air quality monitoring in offices and factories; trusted by both workers and employers."
                            image="/images/industries/air-quality2.png"
                            :reverse="false"
                        />
                    </div>
                    <div class="md:col-span-4">
                        <div class="bg-box rounded-[40px] p-8 flex flex-col gap-4 sticky top-20">
                            <h3>All industries need immutable data</h3>

                            <p>
                                Vitae bibendum enim dolor sapien urna pellentesque leo in. Eu in nibh cursus quis sed
                                rhoncus.
                            </p>

                            <div class="btn">Get started</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="section" id="start">
            <div class="container">
                <div class="bg-box rounded-[40px] p-8 flex flex-col gap-4">
                    <h3>Ready to get started?</h3>

                    <p>
                        Vitae bibendum enim dolor sapien urna pellentesque leo in. Eu in nibh cursus quis sed rhoncus.
                    </p>

                    form here / compute fees

                    <NuxtLink to="/register" class="btn">Register</NuxtLink>
                </div>
            </div>
        </section>

        <Footer />
    </main>
</template>

<script setup>
// const { user, loading, error, isLoggedIn, fetchUser, logout } = useAuth();

// if (process.client) {
// await fetchUser();
// }

// if (user.value) {
//     navigateTo("/dashboard");
// }

useHead({
    title: "TruSense",
});
</script>
