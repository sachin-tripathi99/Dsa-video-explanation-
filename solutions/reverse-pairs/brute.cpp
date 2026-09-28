class Solution {
public:
    int reversePairs(vector<int>& nums) {
        int count = 0, n = nums.size();
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                if (nums[i] > 2LL * nums[j]) count++;           // long long: 2 · nums[j] can overflow
        return count;
    }
};
