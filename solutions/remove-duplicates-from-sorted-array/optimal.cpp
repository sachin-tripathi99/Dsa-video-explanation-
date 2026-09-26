class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        int w = 1;
        for (size_t r = 1; r < nums.size(); r++)
            if (nums[r] != nums[w - 1]) nums[w++] = nums[r];   // new value: write it
        return w;
    }
};
