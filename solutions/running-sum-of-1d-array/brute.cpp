class Solution {
public:
    vector<int> runningSum(vector<int>& nums) {
        vector<int> out(nums.size());
        for (size_t i = 0; i < nums.size(); i++) {
            int s = 0;
            for (size_t j = 0; j <= i; j++) s += nums[j];   // re-add the whole prefix
            out[i] = s;
        }
        return out;
    }
};
