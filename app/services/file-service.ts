import { File, knownFolders, path } from '@nativescript/core';

export class FileService {
    static saveDrawing(imageData: string): Promise<void> {
        const documentsFolder = knownFolders.documents();
        const fileName = `drawing_${Date.now()}.png`;
        const filePath = path.join(documentsFolder.path, fileName);
        
        return new Promise((resolve, reject) => {
            try {
                const file = File.fromPath(filePath);
                const data = imageData.replace(/^data:image\/png;base64,/, '');
                file.writeSync(data);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    static getDrawings(): Array<{ name: string }> {
        const documentsFolder = knownFolders.documents();
        return documentsFolder.getEntities()
            .filter(entity => entity.name.startsWith('drawing_'))
            .map(entity => ({ name: entity.name }));
    }

    static deleteFile(fileName: string): Promise<void> {
        const filePath = path.join(knownFolders.documents().path, fileName);
        return File.fromPath(filePath).remove();
    }
}