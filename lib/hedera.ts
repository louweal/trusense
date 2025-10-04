import { Client, AccountId, Hbar, TransferTransaction, TokenId } from "@hashgraph/sdk";
import type { Topic } from "@prisma/client";
import { useRuntimeConfig } from "nuxt/app";
import { ref } from "vue";
import type { Ref } from "vue";

import { LedgerId } from "@hashgraph/sdk";

export class HederaService {
    private client: Client;
    private network: string;
    private networkUrl: string;

    constructor() {
        const config = useRuntimeConfig();

        // Initialize client based on network
        if (config.public.hederaNetwork === "mainnet") {
            this.client = Client.forMainnet();
            this.network = "mainnet";
            this.networkUrl = "https://mainnet.mirrornode.hedera.com";
        } else {
            this.client = Client.forTestnet();
            this.network = "testnet";
            this.networkUrl = "https://testnet.mirrornode.hedera.com";
        }
    }
}
