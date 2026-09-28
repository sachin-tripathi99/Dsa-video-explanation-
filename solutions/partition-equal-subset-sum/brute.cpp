class Solution {
    bool can(vector<int>& a, int i, int remaining) {
        if (remaining == 0) return true;
        if (i == (int)a.size() || remaining < 0) return false;
        return can(a, i + 1, remaining) || can(a, i + 1, remaining - a[i]);   // skip or take
    }
public:
    bool canPartition(vector<int>& nums) {
        int sum = accumulate(nums.begin(), nums.end(), 0);
        if (sum % 2) return false;
        return can(nums, 0, sum / 2);
    }
};
