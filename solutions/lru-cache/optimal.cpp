class LRUCache {
    int cap;
    list<pair<int, int>> order;                             // front = most recent (key, value)
    unordered_map<int, list<pair<int, int>>::iterator> pos; // key → node in the list
public:
    LRUCache(int capacity) : cap(capacity) {}

    int get(int key) {
        auto it = pos.find(key);
        if (it == pos.end()) return -1;
        order.splice(order.begin(), order, it->second);     // move node to front in O(1)
        return it->second->second;
    }

    void put(int key, int value) {
        auto it = pos.find(key);
        if (it != pos.end()) {
            it->second->second = value;
            order.splice(order.begin(), order, it->second);
            return;
        }
        order.emplace_front(key, value);
        pos[key] = order.begin();
        if ((int)pos.size() > cap) {                        // evict least recent
            pos.erase(order.back().first);
            order.pop_back();
        }
    }
};
