class Solution {
public:
    vector<int> sortedSquares(vector<int>& nums) {
        int n = nums.size(), l = 0, r = n - 1;
        vector<int> out(n);
        for (int k = n - 1; k >= 0; k--) {                  // fill from the back
            if (abs(nums[l]) > abs(nums[r])) { out[k] = nums[l] * nums[l]; l++; }
            else { out[k] = nums[r] * nums[r]; r--; }
        }
        return out;
    }
};
