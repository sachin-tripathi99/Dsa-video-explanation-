class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        int best = 0;
        for (int x : nums) {
            int length = 1;
            while (find(nums.begin(), nums.end(), (long long) x + length) != nums.end()) length++;  // linear scan
            best = max(best, length);
        }
        return best;
    }
};
