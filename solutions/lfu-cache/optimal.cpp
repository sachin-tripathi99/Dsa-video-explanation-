class LFUCache {
    int cap, minFreq = 0;
    unordered_map<int, pair<int, int>> mp;                  // key → (value, freq)
    unordered_map<int, list<int>> buckets;                  // freq → keys, oldest first
    unordered_map<int, list<int>::iterator> pos;            // key → place in its bucket

    void use(int key) {                                     // move key to bucket freq + 1
        int& f = mp[key].second;
        buckets[f].erase(pos[key]);
        if (buckets[f].empty() && f == minFreq) minFreq++;
        f++;
        buckets[f].push_back(key);
        pos[key] = prev(buckets[f].end());
    }
public:
    LFUCache(int capacity) : cap(capacity) {}

    int get(int key) {
        if (!mp.count(key)) return -1;
        use(key);
        return mp[key].first;
    }

    void put(int key, int value) {
        if (mp.count(key)) { mp[key].first = value; use(key); return; }
        if ((int)mp.size() == cap) {                        // evict oldest of the rarest
            int old = buckets[minFreq].front();
            buckets[minFreq].pop_front();
            mp.erase(old);
            pos.erase(old);
        }
        mp[key] = {value, 1};
        buckets[1].push_back(key);
        pos[key] = prev(buckets[1].end());
        minFreq = 1;
    }
};
