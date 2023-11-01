import { Storage } from '@google-cloud/storage';

const storage = new Storage();
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

async function storageDelete(fileName) {
  await bucket.file(fileName).delete();
}

export default storageDelete;
