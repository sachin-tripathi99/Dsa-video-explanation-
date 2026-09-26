class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        int n = nums.size();
        vector<vector<int>> out;
        for (int mask = 0; mask < (1 << n); mask++) {
            vector<int> s;
            for (int i = 0; i < n; i++) if (mask >> i & 1) s.push_back(nums[i]);   // bit i → take nums[i]
            out.push_back(s);
        }
        return out;
    }
};
