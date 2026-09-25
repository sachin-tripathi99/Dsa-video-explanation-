class Solution {
public:
    void rotate(vector<int>& nums, int k) {
        int n = nums.size();
        k %= n;
        reverse(nums.begin(), nums.end());           // whole array
        reverse(nums.begin(), nums.begin() + k);     // first k
        reverse(nums.begin() + k, nums.end());       // the rest
    }
};
