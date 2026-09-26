class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int best = INT_MIN, n = nums.size();
        for (int i = 0; i < n; i++) {
            int s = 0;
            for (int j = i; j < n; j++) {
                s += nums[j];
                best = max(best, s);
            }
        }
        return best;
    }
};
