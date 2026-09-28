class LFUCache {
    int cap, clock = 0;
    unordered_map<int, array<int, 3>> mp;                   // key → {value, uses, last used}
public:
    LFUCache(int capacity) : cap(capacity) {}

    int get(int key) {
        auto it = mp.find(key);
        if (it == mp.end()) return -1;
        it->second[1]++;
        it->second[2] = ++clock;
        return it->second[0];
    }

    void put(int key, int value) {
        auto it = mp.find(key);
        if (it != mp.end()) {
            it->second[0] = value;
            it->second[1]++;
            it->second[2] = ++clock;
            return;
        }
        if ((int)mp.size() == cap) {
            int worst = -1;
            for (auto& [k, x] : mp) {                       // O(capacity) scan
                if (worst < 0) { worst = k; continue; }
                auto& w = mp[worst];
                if (x[1] < w[1] || (x[1] == w[1] && x[2] < w[2])) worst = k;
            }
            mp.erase(worst);
        }
        mp[key] = {value, 1, ++clock};
    }
};
