class Solution {
public:
    vector<int> findErrorNums(vector<int>& nums) {
        int i = 0, n = nums.size();
        while (i < n) {
            int home = nums[i] - 1;
            if (nums[i] != nums[home]) swap(nums[i], nums[home]);
            else i++;
        }
        for (int k = 0; k < n; k++) if (nums[k] != k + 1) return {nums[k], k + 1};   // the one misfit
        return {};
    }
};
