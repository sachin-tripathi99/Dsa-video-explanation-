class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        vector<int> tmp;
        for (int x : nums) if (x != 0) tmp.push_back(x);
        tmp.resize(nums.size(), 0);
        nums = tmp;
    }
};
