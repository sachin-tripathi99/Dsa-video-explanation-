class Solution {
    vector<vector<int>> out;
    vector<int> path;
    void go(vector<int>& c, int start, int remain) {
        if (remain == 0) { out.push_back(path); return; }
        for (int i = start; i < (int)c.size(); i++) {
            if (c[i] > remain) break;                       // sorted: the rest are bigger
            path.push_back(c[i]);
            go(c, i, remain - c[i]);                        // i: reuse allowed
            path.pop_back();
        }
    }
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        sort(candidates.begin(), candidates.end());
        go(candidates, 0, target);
        return out;
    }
};
