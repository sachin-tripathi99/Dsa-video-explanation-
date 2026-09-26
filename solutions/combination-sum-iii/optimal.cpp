class Solution {
    vector<vector<int>> out;
    vector<int> path;
    void go(int k, int start, int remain) {
        if ((int)path.size() == k) { if (remain == 0) out.push_back(path); return; }
        for (int x = start; x <= 9; x++) {
            if (x > remain) break;                          // larger numbers overshoot too
            path.push_back(x);
            go(k, x + 1, remain - x);
            path.pop_back();
        }
    }
public:
    vector<vector<int>> combinationSum3(int k, int n) {
        go(k, 1, n);
        return out;
    }
};
