class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        vector<int> out;
        for (size_t s = 0; s + k <= nums.size(); s++)
            out.push_back(*max_element(nums.begin() + s, nums.begin() + s + k));
        return out;
    }
};
