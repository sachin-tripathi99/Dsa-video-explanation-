class Solution {
public:
    void rotate(vector<int>& nums, int k) {
        int n = nums.size();
        k %= n;
        for (int s = 0; s < k; s++) {
            int last = nums[n - 1];
            for (int i = n - 1; i > 0; i--) nums[i] = nums[i - 1];   // shift right by one
            nums[0] = last;
        }
    }
};
