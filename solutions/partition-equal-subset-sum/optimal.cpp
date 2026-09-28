class Solution {
public:
    bool canPartition(vector<int>& nums) {
        int sum = accumulate(nums.begin(), nums.end(), 0);
        if (sum % 2) return false;
        bitset<10001> reach;                                // bit s: some subset sums to s
        reach[0] = 1;
        for (int x : nums) reach |= reach << x;             // add x to every reachable sum
        return reach[sum / 2];
    }
};
