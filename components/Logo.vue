<template>
    <NuxtLink :to="homeUrl" class="logo inline-flex gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="41" height="41" fill="none">
            <circle cx="20.388" cy="20.388" r="20.388" fill="#072847" />
            <path
                fill="#fff"
                d="M20.373 17.164a1.96 1.96 0 0 1 .498 3.858v13.056h-.997V21.022a1.961 1.961 0 0 1 .499-3.858Z"
            />
            <path
                fill="#fff"
                d="M16.736 26.906c-.444-.02-3.043-2.125-3.848-3.765a7.775 7.775 0 0 1-.585-5.26 7.994 7.994 0 0 1 2.933-4.468 8.487 8.487 0 0 1 5.174-1.732 8.485 8.485 0 0 1 5.165 1.759 7.99 7.99 0 0 1 2.908 4.483c.416 1.77.2 3.622-.614 5.257-.815 1.635-2.995 3.726-3.87 3.745-.873.019-.676-.608-.438-.878.238-.27 2.683-1.853 3.399-3.29a6.831 6.831 0 0 0 .539-4.618 7.02 7.02 0 0 0-2.554-3.938 7.454 7.454 0 0 0-4.537-1.545 7.456 7.456 0 0 0-4.546 1.521 7.023 7.023 0 0 0-2.576 3.925 6.83 6.83 0 0 0 .513 4.622c.708 1.44 3.1 3.062 3.38 3.306.28.245 0 .895-.443.876Z"
            />
            <path
                fill="#fff"
                d="M26.26 31.23c.872.018 4.667-3.481 5.884-6.126a12.958 12.958 0 1 0-23.528.035c1.225 2.641 5.141 6.113 5.902 6.109.761-.004.683-.768.481-.95-.202-.184-4.292-3.183-5.416-5.608a11.893 11.893 0 1 1 16.193 5.591s-.387.932.484.95Z"
            />
        </svg>
        <span class="text-[28px] font-bold text-primary hidden sm:inline"
            ><span class="text-primary">Tru</span>Sense</span
        >
    </NuxtLink>
</template>

<script setup>
const props = defineProps({
    homeUrl: {
        type: String,
        default: "/",
    },
});
</script>

<style scoped>
.logo {
    /* width: 141px;
    height: 24px;

    &:hover {
        .flash {
            animation: flip 0.5s cubic-bezier(0.2, 0, 0.2, 1) forwards;
        }
    }

    .flash {
        transform-origin: center;
        transform-box: fill-box;
    } */
}

@keyframes flip {
    0% {
        transform: scaleX(1);
    }
    50% {
        transform: scaleX(-1);
    }
    100% {
        transform: scaleX(1);
    }
}
</style>
