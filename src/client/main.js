import Dropzone from "dropzone";

const myDropzone = new Dropzone("#my-dropzone", {
    url: "http://localhost:8080/upload",
    paramName: "file",
    maxFilesize: 2 * 1024,
    addRemoveLinks: true,
    dictDefaultMessage: "Upload",
    createImageThumbnails: false,
    previewsContainer: "section.uploaded-output"
});

myDropzone.on("addedfile", (file) => {
    console.log(`${file.name} added to the queue...`);
});

myDropzone.on("sending", (file) => {
    console.log(`Sending file ${file.name}...`);
});

myDropzone.on("success", (file, response) => {
    console.log(`${response.message}`);
});

myDropzone.on("error", (file, response) => {
    console.log("Could not upload file.\n\n");
    console.log(file);
    console.log(response);
});