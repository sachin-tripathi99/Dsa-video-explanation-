class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
        int best = INT_MAX, n = nums.size();
        for (int i = 0; i < n; i++) {
            int s = 0;
            for (int j = i; j < n; j++) {
                s += nums[j];
                if (s >= target) { best = min(best, j - i + 1); break; }
            }
        }
        return best == INT_MAX ? 0 : best;
    }
};
