import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// Khởi tạo Firebase một lần duy nhất
const firebaseConfig = {
    apiKey: "AIzaSyBpIeLo-y2e5YLfPTFrY51gBKyqwX3v7DY",
    authDomain: "endlesstechstoreecommerce.firebaseapp.com",
    projectId: "endlesstechstoreecommerce",
    storageBucket: "endlesstechstoreecommerce.appspot.com",
    messagingSenderId: "698894677458",
    appId: "1:698894677458:web:2d9ef0bf1dcc74efedc40b"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const UploadFileService = {
    uploadUserImage: async (file, oldImagePath = null) => {
        return await UploadFileService.uploadSingleImage(file, "User", oldImagePath);
    },

    uploadBrandImage: async (file, oldImagePath = null) => {
        return await UploadFileService.uploadSingleImage(file, "Brand", oldImagePath);
    },

    uploadPromotionImage: async (file, oldImagePath = null) => {
        return await UploadFileService.uploadSingleImage(file, "Promotion", oldImagePath);
    },

    uploadProductImage: async (file, oldImagePath = null) => {
        return await UploadFileService.uploadSingleImage(file, "Product", oldImagePath);
    },

    uploadRating: async (file, oldImagePath = null) => {
        return await UploadFileService.uploadSingleImage(file, "Rating", oldImagePath);
    },
    

    uploadSingleImage: async (file, folder, oldImagePath = null) => {
        try {
            // Kiểm tra oldImagePath có phải là URL hợp lệ trong Firebase Storage không
            if (oldImagePath && oldImagePath.startsWith("gs://")) {
                await UploadFileService.deleteImage(oldImagePath);
            } else {
                console.warn("Old image path is not a valid Firebase Storage URL, skipping deletion.");
            }

            // Tạo đường dẫn đến tệp trong Firebase Storage
            const uniqueFileName = `${folder}/${Date.now()}_${file.name}`;
            const storageRef = ref(storage, uniqueFileName); // Sử dụng ref để lấy reference

            // Tải lên tệp
            await uploadBytes(storageRef, file); // Sử dụng uploadBytes để tải lên tệp
            const downloadURL = await getDownloadURL(storageRef); // Lấy URL tải về của tệp

            console.log(`Image uploaded to ${folder} successfully!`);
            return downloadURL;
        } catch (error) {
            console.error(`Error uploading image to ${folder}:`, error);
            throw error;
        }
    },

    deleteImage: async (imagePath) => {
        try {
            const storageRef = ref(storage, imagePath); // Sử dụng ref để lấy reference
            await deleteObject(storageRef); // Sử dụng deleteObject để xóa tệp
            console.log(`Image at ${imagePath} deleted successfully!`);
        } catch (error) {
            console.error("Error deleting image:", error);
            throw error;
        }
    },
};

export default UploadFileService;
