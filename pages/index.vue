<template>
    <main>
        <Header />

        <Hero-Home />

        <section class="section" id="features">
            <div class="container">
                <div class="bg-[rgba(255,249,244,0.5)] rounded-[40px] py-20 px-8">
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

        Contact

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
