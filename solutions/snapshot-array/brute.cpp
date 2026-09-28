class SnapshotArray {
    vector<int> cur;
    vector<vector<int>> copies;
public:
    SnapshotArray(int length) : cur(length) {}

    void set(int index, int val) {
        cur[index] = val;
    }

    int snap() {
        copies.push_back(cur);                              // O(n) copy every time
        return copies.size() - 1;
    }

    int get(int index, int snap_id) {
        return copies[snap_id][index];
    }
};
