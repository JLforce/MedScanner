import AsyncStorage from '@react-native-async-storage/async-storage';
import { ParsedMedication } from '../types';

export interface SavedMedicationScan extends ParsedMedication {
  id: string;
  savedAt: number;
  source: 'auto-lock' | 'manual-lock';
}

const STORAGE_KEY = '@medscanner/scan-history';
const MAX_HISTORY_ITEMS = 100;

export class ScanHistoryService {
  private static instance: ScanHistoryService;

  private constructor() {}

  public static getInstance(): ScanHistoryService {
    if (!ScanHistoryService.instance) {
      ScanHistoryService.instance = new ScanHistoryService();
    }
    return ScanHistoryService.instance;
  }

  async saveParsedMedication(
    parsed: ParsedMedication,
    source: SavedMedicationScan['source']
  ): Promise<SavedMedicationScan> {
    const entry: SavedMedicationScan = {
      ...parsed,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      savedAt: Date.now(),
      source,
    };

    const existing = await this.getHistory();
    const updated = [entry, ...existing].slice(0, MAX_HISTORY_ITEMS);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return entry;
  }

  async getHistory(): Promise<SavedMedicationScan[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as SavedMedicationScan[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  async clearHistory(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
}
