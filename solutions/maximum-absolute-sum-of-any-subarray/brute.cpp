class Solution {
public:
    int maxAbsoluteSum(vector<int>& nums) {
        int best = 0, n = nums.size();
        for (int i = 0; i < n; i++) {
            int s = 0;
            for (int j = i; j < n; j++) {
                s += nums[j];
                best = max(best, abs(s));
            }
        }
        return best;
    }
};
