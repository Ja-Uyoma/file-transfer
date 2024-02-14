import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                signup: resolve(__dirname, "src/client/sign-up.html"),
                login: resolve(__dirname, "src/client/login.html")
            }
        }
    }
})