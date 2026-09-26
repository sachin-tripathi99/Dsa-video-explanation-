class Solution {
    bool reach(vector<int>& nums, int i) {
        if (i >= (int)nums.size() - 1) return true;
        for (int step = 1; step <= nums[i]; step++)
            if (reach(nums, i + step)) return true;
        return false;
    }
public:
    bool canJump(vector<int>& nums) {
        return reach(nums, 0);
    }
};
