class Solution {
public:
    bool canJump(vector<int>& nums) {
        int n = nums.size();
        vector<bool> good(n, false);
        good[n - 1] = true;
        for (int i = n - 2; i >= 0; i--)
            for (int step = 1; step <= nums[i] && i + step < n; step++)
                if (good[i + step]) { good[i] = true; break; }
        return good[0];
    }
};
