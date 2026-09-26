class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int best = nums[0], n = nums.size();
        for (int i = 0; i < n; i++) {
            int p = 1;
            for (int j = i; j < n; j++) {
                p *= nums[j];
                best = max(best, p);
            }
        }
        return best;
    }
};
