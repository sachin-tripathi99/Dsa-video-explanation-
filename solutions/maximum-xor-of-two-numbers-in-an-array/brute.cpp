class Solution {
public:
    int findMaximumXOR(vector<int>& nums) {
        int best = 0;
        for (int i = 0; i < (int)nums.size(); i++)
            for (int j = i + 1; j < (int)nums.size(); j++) best = max(best, nums[i] ^ nums[j]);   // every pair
        return best;
    }
};
