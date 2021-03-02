import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import bodyParser from "body-parser";

import { uploadImage } from "./fileUpload";
import { apolloServer, authMiddleware } from "./apolloServer";

dotenv.config();

const startServer = async () => {
  const app = express();

  const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });

  app.use(cors("*"));

  app.disable("x-powered-by");
  app.use(multerMid.single("file"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(authMiddleware);

  app.post("/uploads", async (req, res, next) => {
    try {
      const myFile = req.file;
      const imageUrl = await uploadImage(myFile);
      res.status(200).json({
        message: "Upload was successful",
        data: imageUrl,
      });
    } catch (error) {
      next(error);
    }
  });

  apolloServer.applyMiddleware({ app });

  await mongoose.connect(process.env.MONGO_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app.listen({ port: process.env.PORT || 4000 }, () =>
    console.log(
      `🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`
    )
  );
};

startServer();
