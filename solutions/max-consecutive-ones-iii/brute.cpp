class Solution {
public:
    int longestOnes(vector<int>& nums, int k) {
        int best = 0, n = nums.size();
        for (int i = 0; i < n; i++) {
            int zeros = 0;
            for (int j = i; j < n; j++) {
                if (nums[j] == 0) zeros++;
                if (zeros > k) break;
                best = max(best, j - i + 1);
            }
        }
        return best;
    }
};
