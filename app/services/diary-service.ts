import { File, knownFolders, path } from '@nativescript/core';
import { DiaryEntry } from '../models/diary-entry';

export class DiaryService {
    private static readonly ENTRIES_FILE = 'diary_entries.json';

    static loadEntries(): Array<DiaryEntry> {
        try {
            const filePath = path.join(knownFolders.documents().path, this.ENTRIES_FILE);
            const file = File.fromPath(filePath);
            const content = file.readTextSync();
            return JSON.parse(content);
        } catch {
            return [];
        }
    }

    static saveEntries(entries: Array<DiaryEntry>): void {
        const filePath = path.join(knownFolders.documents().path, this.ENTRIES_FILE);
        const file = File.fromPath(filePath);
        file.writeTextSync(JSON.stringify(entries));
    }
}