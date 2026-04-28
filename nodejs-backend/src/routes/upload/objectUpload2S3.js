const s3Client = require("./s3Client");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
const fs = require("fs");
const URL = process.env.S3_URL;
const FOLDER = process.env.PROJECT_NAME;
const BUCKET = process.env.S3_BUCKET;
const USE_S3 = !!(process.env.S3_ACCESS_KEY && process.env.S3_ACCESS_SECRET);

async function objectUpload2S3(request, response) {
  const { tableId, tableName } = request.body;
  const user = request.body.user ? JSON.parse(request.body.user) : {};
  const files = request.files; // Access uploaded files via request.files

  if (!files || files.length === 0) {
    return response.status(400).json({
      status: false,
      message: "No files uploaded",
    });
  }

  try {
    const uploadPromises = files.map(async (file) => {
      let url;

      if (USE_S3) {
        const params = {
          Bucket: BUCKET,
          Key: `${FOLDER}/${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        const s3Response = await s3Client.send(new PutObjectCommand(params));

        if (typeof s3Response.VersionId !== "string") {
          const message = `Error uploading file to S3: ${file.originalname}`;
          console.error(message);
          return { status: false, message };
        }

        url = `${URL}/${file.originalname}`;
      } else {
        // Local storage fallback when S3 is not configured
        const uploadDir = path.join(__dirname, "../../../public/uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filename = `${Date.now()}-${file.originalname}`;
        fs.writeFileSync(path.join(uploadDir, filename), file.buffer);
        url = `/uploads/${filename}`;
        console.log(`[Local Upload] Saved file to ${url}`);
      }

      const data = {
        lastModified: file.lastModified,
        lastModifiedDate: new Date(),
        name: file.originalname,
        size: file.size,
        path: `${FOLDER}/${file.originalname}`,
        type: file.mimetype,
        url,
        tableId,
        tableName,
        createdBy: user._id || null,
        updatedBy: user._id || null,
      };

      const createdDocument =
        await request.appInstance.services.documentStorages.create(data);
      console.debug("File uploaded successfully:", createdDocument);

      return {
        status: true,
        message: "File uploaded successfully",
        url,
        documentId: createdDocument._id,
      };
    });

    const results = await Promise.all(uploadPromises);

    // Check if any uploads failed
    const allUploadsSuccessful = results.every((result) => result.status);
    if (allUploadsSuccessful) {
      return response.status(200).json({
        status: true,
        message: "Files uploaded successfully",
        results: results,
      });
    } else {
      // At least one upload failed
      const failedUploads = results.filter((result) => !result.status);
      return response.status(500).json({
        status: false,
        message: "Some files failed to upload",
        failedUploads: failedUploads,
      });
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return response.status(500).json({ status: false, message: error.message });
  }
}

module.exports = objectUpload2S3;
