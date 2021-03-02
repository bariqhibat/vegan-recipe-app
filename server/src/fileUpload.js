import path from "path";
import { Storage } from "@google-cloud/storage";

// Creates a client
const gc = new Storage({
  keyFilename:
    process.env.NODE_ENV === "production"
      ? path.join(__dirname, "../google-credentials.json")
      : path.join(__dirname, "../affable-grin-291001-a2b89eae50a5.json"),
  projectId: "affable-grin-291001",
});

const bucket = gc.bucket("vegan-app");

async function configureBucketCors() {
  await bucket.setCorsConfiguration([
    {
      origin: ["*"],
      responseHeader: [
        "X-Requested-With",
        "Authorization",
        "Content-Range",
        "Accept",
        "Content-Type",
        "Origin",
        "Range",
        "Content-Disposition",
      ],
      method: ["GET", "HEAD", "DELETE", "PUT", "POST"],
      maxAgeSeconds: 3600,
    },
  ]);

  // console.log(`Bucket ${bucket.name} was updated with a CORS config
  //     to allow ${method} requests from ${origin} sharing
  //     ${responseHeader} responses across origins`);
}

configureBucketCors();

/**
 * Stores a GraphQL file upload. The file is stored in the filesystem and its
 * metadata is recorded in the DB.
 * @param {GraphQLUpload} upload GraphQL file upload.
 * @returns {object} File metadata.
 */

export const storeUpload = async (upload) => {
  const { createReadStream, mimetype, originalname } = await upload;

  let url = "";
  await new Promise((resolve, reject) => {
    const file = bucket
      .file(path)
      .createWriteStream()
      .on("finish", () => {
        bucket
          .file(originalname) // make the file public
          .makePublic()
          .then(() => {
            url = `https://storage.googleapis.com/${bucket.name}/${originalname}`;
            resolve();
          }) // eslint-disable-next-line
          .catch((e) => {
            // eslint-disable-next-line
            reject((e) => {
              console.log(e);
              return {
                ok: false,
              };
            });
          });
      })
      .on("error", (e) => {
        console.log(e);
        return {
          ok: false,
        };
      });
    createReadStream().pipe(file);
  });

  return { ok: true, file: { mimetype, url } };
};

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

export const uploadImage = (file) =>
  new Promise((resolve, reject) => {
    const { originalname, buffer } = file;

    const blob = bucket.file(originalname.replace(/ /g, "_"));
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream
      .on("finish", () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      })
      .on("error", (err) => {
        console.log({ err });
        reject(new Error("Unable to upload image, something went wrong"));
      })
      .end(buffer);
  });
