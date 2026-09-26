class Solution {
public:
    vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
        int n = candidates.size();
        set<vector<int>> seen;
        for (int mask = 0; mask < (1 << n); mask++) {
            int sum = 0;
            vector<int> s;
            for (int i = 0; i < n; i++) if (mask >> i & 1) { sum += candidates[i]; s.push_back(candidates[i]); }
            if (sum == target) { sort(s.begin(), s.end()); seen.insert(s); }
        }
        return vector<vector<int>>(seen.begin(), seen.end());
    }
};
