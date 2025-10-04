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
                            title="Cold chain logistics"
                            description="Monitor temperature-sensitive pharmaceuticals, vaccines, and food products during storage and transportation."
                            image="/images/industries/logistics.jpg"
                        />
                        <CardIndustry
                            title="Greenhouses"
                            description="Optimize growing conditions for maximum crop yield with precise environmental control."
                            image="/images/industries/greenhouses.jpg"
                            :reverse="true"
                        />
                        <CardIndustry
                            title="Museums & art galleries"
                            description="Preserve valuable artifacts and artworks with precise climate control and monitoring."
                            image="/images/industries/museums.jpg"
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
                            description="Maintain perfect aging conditions for premium wines and spirits with precise control."
                            image="/images/industries/wine.jpg"
                            :reverse="false"
                        />

                        <CardIndustry
                            title="Healthcare Facilities"
                            description="Ensure patient safety and medication efficacy with hospital-grade environmental monitoring."
                            image="/images/industries/healthcare.jpg"
                            :reverse="true"
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
