class Solution {
public:
    vector<int> findDuplicates(vector<int>& nums) {
        vector<int> out;
        for (int x : nums) {
            int j = abs(x) - 1;
            if (nums[j] < 0) out.push_back(abs(x));   // seen before
            else nums[j] = -nums[j];                  // mark as seen
        }
        return out;
    }
};
