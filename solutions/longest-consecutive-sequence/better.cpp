class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        if (nums.empty()) return 0;
        sort(nums.begin(), nums.end());
        int best = 1, run = 1;
        for (size_t i = 1; i < nums.size(); i++) {
            if (nums[i] == nums[i - 1]) continue;               // duplicate: ignore
            if ((long long) nums[i] == (long long) nums[i - 1] + 1) run++;
            else run = 1;
            best = max(best, run);
        }
        return best;
    }
};
