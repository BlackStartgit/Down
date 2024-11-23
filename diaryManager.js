import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIARY_FILE = path.join(__dirname, 'diary.json');

export class DiaryManager {
  constructor() {
    this.entries = this.loadEntries();
  }

  loadEntries() {
    try {
      if (fs.existsSync(DIARY_FILE)) {
        const data = fs.readFileSync(DIARY_FILE, 'utf8');
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error('Error loading entries:', error);
      return [];
    }
  }

  saveEntries() {
    try {
      fs.writeFileSync(DIARY_FILE, JSON.stringify(this.entries, null, 2));
    } catch (error) {
      console.error('Error saving entries:', error);
    }
  }

  addEntry(entry) {
    this.entries.push(entry);
    this.saveEntries();
  }

  getEntries() {
    return this.entries;
  }

  deleteEntry(index) {
    this.entries.splice(index, 1);
    this.saveEntries();
  }
}