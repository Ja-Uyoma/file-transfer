import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";

Dropzone.autoDiscover = false;

document.addEventListener("DOMContentLoaded", () => {
    const myDropzone = new Dropzone("#my-dropzone", {
        url: "http://localhost:8080/upload",
        paramName: "file",
        maxFilesize: 2 * 1024
    });
    
    myDropzone.on("addedfile", (file, response) => {
        console.log(file);
        console.log(response);
    });

    myDropzone.on("error", (file, response) => {
        console.log("Could not upload file.\n\n");
        console.log(file);
        console.log(response);
    })
});