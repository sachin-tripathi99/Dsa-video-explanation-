class Solution {
    vector<vector<int>> out;
    vector<int> path;
    void go(vector<int>& c, int start, int remain) {
        if (remain == 0) { out.push_back(path); return; }
        for (int i = start; i < (int)c.size(); i++) {
            if (i > start && c[i] == c[i - 1]) continue;    // duplicate at this depth
            if (c[i] > remain) break;                       // overshoot
            path.push_back(c[i]);
            go(c, i + 1, remain - c[i]);                    // i + 1: use once
            path.pop_back();
        }
    }
public:
    vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
        sort(candidates.begin(), candidates.end());
        go(candidates, 0, target);
        return out;
    }
};
