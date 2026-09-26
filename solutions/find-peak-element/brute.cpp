class Solution {
public:
    int findPeakElement(vector<int>& nums) {
        for (size_t i = 0; i + 1 < nums.size(); i++) if (nums[i] > nums[i + 1]) return i;
        return nums.size() - 1;
    }
};
