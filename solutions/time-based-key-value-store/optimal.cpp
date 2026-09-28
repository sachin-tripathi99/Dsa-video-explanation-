class TimeMap {
    unordered_map<string, vector<pair<int, string>>> hist; // key → (time, value), sorted by time
public:
    TimeMap() {}

    void set(string key, string value, int timestamp) {
        hist[key].emplace_back(timestamp, value);
    }

    string get(string key, int timestamp) {
        auto it = hist.find(key);
        if (it == hist.end()) return "";
        auto& h = it->second;
        int lo = 0, hi = (int)h.size() - 1, best = -1;
        while (lo <= hi) {                                  // last time ≤ timestamp
            int mid = (lo + hi) / 2;
            if (h[mid].first <= timestamp) { best = mid; lo = mid + 1; }
            else hi = mid - 1;
        }
        return best < 0 ? "" : h[best].second;
    }
};
