class Solution {
public:
    void rotate(vector<int>& nums, int k) {
        int n = nums.size();
        vector<int> out(n);
        for (int i = 0; i < n; i++) out[(i + k) % n] = nums[i];   // final position of nums[i]
        nums = out;
    }
};
