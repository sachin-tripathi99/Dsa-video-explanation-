class Solution {
public:
    int missingNumber(vector<int>& nums) {
        int n = nums.size();
        int expected = n * (n + 1) / 2;         // 0 + 1 + … + n
        return expected - accumulate(nums.begin(), nums.end(), 0);
    }
};
