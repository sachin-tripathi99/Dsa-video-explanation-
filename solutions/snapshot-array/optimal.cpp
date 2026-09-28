class SnapshotArray {
    vector<vector<pair<int, int>>> hist;                    // per index: (snapId, value)
    int snapId = 0;
public:
    SnapshotArray(int length) : hist(length, vector<pair<int, int>>{{-1, 0}}) {}   // sentinel

    void set(int index, int val) {
        auto& h = hist[index];
        if (h.back().first == snapId) h.back().second = val;    // same snapshot: overwrite
        else h.emplace_back(snapId, val);
    }

    int snap() {
        return snapId++;
    }

    int get(int index, int snap_id) {
        auto& h = hist[index];
        auto it = upper_bound(h.begin(), h.end(), make_pair(snap_id, INT_MAX));   // first snap > snap_id
        return prev(it)->second;
    }
};
