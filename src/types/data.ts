export interface DataSource {
    url: string; // e.g. "https://api.example.com/data"
    sourceType:  string; // e.g. "rest", "adei", ...
}

export interface DataEntry {
    id: string; // e.g. sensor id
    timestamp: number; // unix timestamp in ms
    value: number; // e.g. sensor value
}