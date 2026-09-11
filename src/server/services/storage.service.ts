export async function getUploadUrl(path: string) {
  return `/uploads/${path}`;
}

export async function deleteFile(_path: string) {
  return { ok: true };
}
