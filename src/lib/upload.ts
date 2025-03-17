import { storage } from "./firebase"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { v4 as uuidv4 } from "uuid"

export async function uploadImageToFirebase(file: File, folder = "avatars"): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"))
      return
    }

    // Create a unique file name
    const fileExtension = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    const storageRef = ref(storage, `${folder}/${fileName}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // You can track progress here if needed
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log(`Upload is ${progress}% done`)
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error("Upload failed:", error)
        reject(error)
      },
      async () => {
        // Handle successful uploads
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        resolve(downloadURL)
      },
    )
  })
}

