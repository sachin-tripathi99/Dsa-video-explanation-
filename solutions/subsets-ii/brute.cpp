class Solution {
public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        int n = nums.size();
        set<vector<int>> seen;
        for (int mask = 0; mask < (1 << n); mask++) {
            vector<int> s;
            for (int i = 0; i < n; i++) if (mask >> i & 1) s.push_back(nums[i]);
            sort(s.begin(), s.end());                       // same multiset → same vector
            seen.insert(s);
        }
        return vector<vector<int>>(seen.begin(), seen.end());
    }
};
