import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                signup: resolve(__dirname, "src/client/sign-up.html"),
                dropzone: resolve(__dirname, "src/client/dropzone.html")
            }
        }
    }
})