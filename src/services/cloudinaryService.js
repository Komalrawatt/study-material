const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload a file to Cloudinary (unsigned upload)
 * @param {File} file - The file to upload
 * @param {string} folder - The folder in Cloudinary (e.g., "materials", "profiles")
 * @param {function} onProgress - Callback for upload progress (0-100)
 * @returns {{ url: string, publicId: string, format: string, resourceType: string, bytes: number }}
 */
export const uploadToCloudinary = (file, folder = "study-material", onProgress) => {
  return new Promise((resolve, reject) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      reject(new Error("Cloudinary credentials not configured. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env"));
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", folder);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        resolve({
          url: response.secure_url,
          publicId: response.public_id,
          format: response.format,
          resourceType: response.resource_type,
          bytes: response.bytes,
          originalFilename: response.original_filename,
        });
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Upload failed")));
    xhr.send(formData);
  });
};

/**
 * Get a Cloudinary URL with transformations
 * @param {string} publicId - The public ID of the resource
 * @param {object} options - Transformation options
 * @returns {string} The transformed URL
 */
export const getCloudinaryUrl = (publicId, options = {}) => {
  const { width, height, crop = "fill", quality = "auto" } = options;
  let transforms = `q_${quality}`;
  if (width) transforms += `,w_${width}`;
  if (height) transforms += `,h_${height}`;
  if (crop) transforms += `,c_${crop}`;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
};
