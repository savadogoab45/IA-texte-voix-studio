import type { UploadFileDto } from "../dtos/upload-file.dto";
import { StorageProviderFactory } from "../factory/storage-provider.factory";
import { StorageProviderType } from "@prisma/client";

export class UploadFileService {

    async execute(dto: UploadFileDto) {

        const provider =
            StorageProviderFactory.create(
                StorageProviderType.LOCAL,
            );

        return provider.upload(dto);

    }

}