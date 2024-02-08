import Dropzone from "dropzone";

document.addEventListener("DOMContentLoaded", () => {
    const myDropzone = new Dropzone("#my-dropzone", {
        url: "http://localhost:8080/upload",
        paramName: "file",
        maxFilesize: 2 * 1024,
        addRemoveLinks: true,
        dictRemoveFileConfirmation: "Confirm file removal",
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
    
    myDropzone.on("removedfile", function (file) {
        if (file) {
            // Send a request to the server to delete the file
            fetch("/delete-file", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ filename: file.name })   // send the file name to the server
            })
            .then(response => {
                if (response.ok) {
                    console.log("File deleted successfully");
                }
                else {
                    throw new Error("Error deleting file");
                }
            })
            .catch(error => {
                console.error("Error deleting file: ", error.message);
            });
        }
    });
});