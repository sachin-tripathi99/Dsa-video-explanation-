class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
        int l = 0, s = 0, best = INT_MAX;
        for (int r = 0; r < (int)nums.size(); r++) {
            s += nums[r];
            while (s >= target) {                   // valid: record, then try shorter
                best = min(best, r - l + 1);
                s -= nums[l++];
            }
        }
        return best == INT_MAX ? 0 : best;
    }
};
