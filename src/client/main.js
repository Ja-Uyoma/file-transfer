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

        const uploadedFiles = getFilesFromLocalStorage();
        uploadedFiles.push({ name: file.name, size: file.size, type: file.type });
        saveFilesToLocalStorage(uploadedFiles);
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

    // Function to save uploaded files to localStorage
    const saveFilesToLocalStorage = files => {
        localStorage.setItem("uploadedFiles", JSON.stringify(files));
    };

    // Function to retrieve uploaded files from localStorage
    const getFilesFromLocalStorage = () => {
        const filesJSON = localStorage.getItem("uploadedFiles");
        return filesJSON ? JSON.parse(filesJSON) : [];
    };
    
    // Function to update Dropzone previews with files from localStorage
    const updatePreview = () => {
        const uploadedFiles = getFilesFromLocalStorage();

        // Add each file in uploadedFiles as a preview
        uploadedFiles.forEach(file => {
            // Create a mock file object for Dropzone
            const mockFile = {
                name: file.name,
                size: file.size,
                type: file.type
            };

            // Add the mock file to Dropzone's file previews
            myDropzone.files.push(mockFile);
            myDropzone.emit("addedfile", mockFile);
            myDropzone.createThumbnailFromUrl(mockFile, file.url);
            myDropzone.emit("complete", mockFile);  // signal Dropzone that the file upload is complete
        });
    };

    updatePreview();
});