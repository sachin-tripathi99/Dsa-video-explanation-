class Solution {
public:
    int removeElement(vector<int>& nums, int val) {
        vector<int> keep;
        for (int x : nums) if (x != val) keep.push_back(x);
        for (size_t i = 0; i < keep.size(); i++) nums[i] = keep[i];
        return keep.size();
    }
};
