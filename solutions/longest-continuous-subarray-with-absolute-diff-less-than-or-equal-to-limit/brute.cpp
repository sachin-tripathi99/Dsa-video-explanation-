class Solution {
public:
    int longestSubarray(vector<int>& nums, int limit) {
        int best = 0, n = nums.size();
        for (int i = 0; i < n; i++) {
            int mx = nums[i], mn = nums[i];
            for (int j = i; j < n; j++) {
                mx = max(mx, nums[j]);
                mn = min(mn, nums[j]);
                if (mx - mn > limit) break;
                best = max(best, j - i + 1);
            }
        }
        return best;
    }
};
