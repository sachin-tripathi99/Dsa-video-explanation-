class Solution {
    vector<vector<int>> out;
    vector<int> path;
    void go(int n, int k, int start) {
        if ((int)path.size() == k) { out.push_back(path); return; }
        int need = k - path.size();
        for (int x = start; x <= n - need + 1; x++) {       // enough numbers left
            path.push_back(x);
            go(n, k, x + 1);
            path.pop_back();
        }
    }
public:
    vector<vector<int>> combine(int n, int k) {
        go(n, k, 1);
        return out;
    }
};
