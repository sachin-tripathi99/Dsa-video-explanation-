class Solution {
public:
    int pivotIndex(vector<int>& nums) {
        int n = nums.size();
        for (int i = 0; i < n; i++) {
            int left = 0, right = 0;
            for (int k = 0; k < i; k++) left += nums[k];
            for (int k = i + 1; k < n; k++) right += nums[k];
            if (left == right) return i;
        }
        return -1;
    }
};
