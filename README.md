# MongoDB Image Upload Demo

A minimal Node.js + Express application that shows how to:

- Upload images from a browser form  
- Store the raw binary data in **MongoDB GridFS** via `multer-gridfs-storage`  
- Stream the images back to the client without writing to disk  

The project is deliberately lightweight so you can grasp the GridFS workflow and re-use the code in larger services.

---

## Tech stack

| Layer | Key libs / tools | Notes |
|-------|-----------------|-------|
| Backend | **Express 4**, **mongoose**, **multer-gridfs-storage**, **gridfs-stream** | Streams files straight into GridFS buckets so they’re split into efficient chunks :contentReference[oaicite:0]{index=0} |
| Database | **MongoDB 6.x** | GridFS stores metadata in `<bucket>.files` and chunks in `<bucket>.chunks` :contentReference[oaicite:1]{index=1} |
| Front-end | Plain HTML/CSS/JS in `/client` | Keeps the demo framework-agnostic; drop into React/Vue easily |
| Dev tools | **nodemon** (auto-reload), VS Code launch profile | Zero-config local development |

---

## Project structure

