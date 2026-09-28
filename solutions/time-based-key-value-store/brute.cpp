class TimeMap {
    unordered_map<string, vector<pair<int, string>>> hist; // key → (time, value)
public:
    TimeMap() {}

    void set(string key, string value, int timestamp) {
        hist[key].emplace_back(timestamp, value);
    }

    string get(string key, int timestamp) {
        auto it = hist.find(key);
        if (it == hist.end()) return "";
        auto& h = it->second;
        for (int i = (int)h.size() - 1; i >= 0; i--)        // walk back from the newest
            if (h[i].first <= timestamp) return h[i].second;
        return "";
    }
};
