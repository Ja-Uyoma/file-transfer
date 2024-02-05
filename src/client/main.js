import Dropzone from "dropzone";

const myDropzone = new Dropzone("#my-dropzone");
myDropzone.on("addedfile", (file) => {
    console.log(`Added file: ${file.name}`);
});