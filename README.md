# file-transfer
A website that lets you upload files that are then transferred to a remote server

## Build and run
The project was built and tested on Node version 20.8.0.

- After cloning the repo, navigate to the project's root directory and run
`npm install`.

### Development builds

- For a development build, we have to install Nodemon.
- Open your terminal and run `npm install -g nodemon`.
- Finally, run `npm run start`.

### Release builds

- For release builds, we first have to build the static assets to be served using Vite.
- We must therefore run `npm run build`, followed by `npm run start`.
- To test the app locally, run a preview build by opening another terminal 
    in the same directory and running `npm run preview`.