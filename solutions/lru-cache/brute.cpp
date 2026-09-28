class LRUCache {
    int cap, time = 0;
    unordered_map<int, pair<int, int>> mp;                  // key → {value, last used}
public:
    LRUCache(int capacity) : cap(capacity) {}

    int get(int key) {
        auto it = mp.find(key);
        if (it == mp.end()) return -1;
        it->second.second = ++time;
        return it->second.first;
    }

    void put(int key, int value) {
        if (!mp.count(key) && (int)mp.size() == cap) {
            int oldest = -1, t = INT_MAX;
            for (auto& [k, e] : mp)                         // O(capacity) scan
                if (e.second < t) { t = e.second; oldest = k; }
            mp.erase(oldest);
        }
        mp[key] = {value, ++time};
    }
};
