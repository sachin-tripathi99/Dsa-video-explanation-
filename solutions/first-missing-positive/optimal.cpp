class Solution {
public:
    int firstMissingPositive(vector<int>& nums) {
        int n = nums.size(), i = 0;
        while (i < n) {
            int x = nums[i];
            if (x >= 1 && x <= n && nums[x - 1] != x) swap(nums[i], nums[x - 1]);   // in range, home free
            else i++;
        }
        for (int k = 0; k < n; k++) if (nums[k] != k + 1) return k + 1;
        return n + 1;
    }
};
