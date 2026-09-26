class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        int w = 0;
        for (size_t r = 0; r < nums.size(); r++)
            if (nums[r] != 0) swap(nums[w++], nums[r]);
    }
};
