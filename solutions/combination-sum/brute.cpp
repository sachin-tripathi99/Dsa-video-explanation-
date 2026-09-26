class Solution {
    set<vector<int>> seen;
    void go(vector<int>& c, int remain, vector<int>& seq) {
        if (remain == 0) {
            vector<int> s = seq;
            sort(s.begin(), s.end());                       // order duplicates collapse here
            seen.insert(s);
            return;
        }
        for (int x : c) {                                   // any candidate, any order
            if (x > remain) continue;
            seq.push_back(x);
            go(c, remain - x, seq);
            seq.pop_back();
        }
    }
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        vector<int> seq;
        go(candidates, target, seq);
        return vector<vector<int>>(seen.begin(), seen.end());
    }
};
