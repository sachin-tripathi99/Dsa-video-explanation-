class Solution {
public:
    int longestOnes(vector<int>& nums, int k) {
        int l = 0, zeros = 0, best = 0;
        for (int r = 0; r < (int)nums.size(); r++) {
            if (nums[r] == 0) zeros++;
            while (zeros > k) if (nums[l++] == 0) zeros--;   // shrink until valid
            best = max(best, r - l + 1);
        }
        return best;
    }
};
