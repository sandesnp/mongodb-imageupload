# MongoDB Image Upload Demo

A minimal Node.js + Express application that shows how to:

- Upload images from a browser form  
- Store the raw binary data in **MongoDB GridFS** via `multer-gridfs-storage`  
- Stream the images back to the client without writing to disk  

The project is deliberately lightweight so you can grasp the GridFS workflow and re-use the code in larger services.

---

## Tech stack

| Layer     | Key libs / tools                                        | Notes                                                                    |
|-----------|---------------------------------------------------------|--------------------------------------------------------------------------|
| Backend   | **Express 4**, **mongoose**, **multer-gridfs-storage**, **gridfs-stream** | Streams files straight into GridFS buckets so they’re split into chunks |
| Database  | **MongoDB 6.x**                                         | GridFS stores metadata in `<bucket>.files` and chunks in `<bucket>.chunks` |
| Front-end | Plain HTML/CSS/JS in `/client`                          | Framework-agnostic; easy to drop into React/Vue                         |
| Dev tools | **nodemon** (auto-reload), VS Code launch profile       | Zero-config local development                                            |

---

## Project structure

    mongodb-imageupload/
    │
    ├─ client/            # static front-end – form & gallery
    │   ├─ index.html
    │   └─ main.js
    │
    ├─ app.js             # Express server / API routes
    ├─ package.json
    └─ .env.example       # copy → .env and add your Mongo URI

---

## Prerequisites

* **Node.js 18+** and **npm**  
* A running **MongoDB** instance (local Docker container or Atlas cluster)  
* Optional: `mongosh` for inspecting the `uploads.files` and `uploads.chunks` collections

---

## Quick start

    # 1. Clone and install deps
    git clone https://github.com/sandesnp/mongodb-imageupload.git
    cd mongodb-imageupload
    npm install

    # 2. Configure env vars (see .env.example)
    cp .env.example .env
    # edit MONGODB_URI=mongodb://<user>:<pass>@localhost:27017/image-demo

    # 3. Launch dev server
    npm run dev      # nodemon
    # or
    node app.js

The client is served at **http://localhost:3000**.  
Upload a file and it should appear instantly in the gallery grid.

---

## API reference

| Method | Route             | Body / Query                         | Purpose                                                |
|--------|-------------------|--------------------------------------|--------------------------------------------------------|
| POST   | `/upload`         | `multipart/form-data` field **photo**| Streams file to GridFS                                 |
| GET    | `/files`          | –                                    | JSON list of stored files                              |
| GET    | `/image/:filename`| –                                    | Sends `image/*` stream to the browser                  |
| DELETE | `/files/:id`      | –                                    | Removes file (+ its chunks) from the bucket            |

---

## How it works

1. **Storage engine** – `multer-gridfs-storage` connects to MongoDB once and pipes each incoming file into GridFS.  
2. **Bucket naming** – files land in the default `uploads` bucket; override via the `bucketName` option.  
3. **Streaming back** – `gridfs-stream` opens a download stream and pipes it straight to `res`, saving memory.  
4. **Chunk cleanup** – deleting by `_id` removes both the file document and all related chunks.  

---

## Running with Docker (optional)

    # Spin up MongoDB 6 with auth
    docker run -d --name mongo \
      -e MONGO_INITDB_ROOT_USERNAME=admin \
      -e MONGO_INITDB_ROOT_PASSWORD=secret \
      -p 27017:27017 mongo:6

    # Then start the app as above
    # (point MONGODB_URI to mongodb://admin:secret@localhost:27017)

---

## Road-map / Ideas

- 💾 **S3 backup** – schedule an automatic export of GridFS buckets  
- 🖼️ **Thumbnail generation** – pipe upload stream through `sharp` before saving  
- 🔐 **Auth** – protect upload route with Passport strategies (JWT & Google)  
- 🐳 **Docker-Compose** – single-command local stack for easy onboarding  

---

## License

MIT © 2025 Sandesh Shrestha
