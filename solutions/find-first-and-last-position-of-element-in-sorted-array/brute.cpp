class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        int l = -1, r = -1;
        for (int i = 0; i < (int)nums.size(); i++)
            if (nums[i] == target) { if (l < 0) l = i; r = i; }
        return {l, r};
    }
};
