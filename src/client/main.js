import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";

const myDropzone = new Dropzone("#my-dropzone");
myDropzone.on("addedfile", (file) => {
    console.log(`Added file: ${file.name}`);
});