class Solution {
public:
    int findMaxLength(vector<int>& nums) {
        int best = 0, n = nums.size();
        for (int i = 0; i < n; i++) {
            int bal = 0;
            for (int j = i; j < n; j++) {
                bal += nums[j] ? 1 : -1;
                if (bal == 0) best = max(best, j - i + 1);
            }
        }
        return best;
    }
};
