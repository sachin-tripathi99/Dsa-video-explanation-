class Solution {
    vector<vector<int>> memo;                               // −1 unknown, 0 false, 1 true
    bool can(vector<int>& a, int i, int remaining) {
        if (remaining == 0) return true;
        if (i == (int)a.size() || remaining < 0) return false;
        if (memo[i][remaining] != -1) return memo[i][remaining];   // solved before
        return memo[i][remaining] = can(a, i + 1, remaining) || can(a, i + 1, remaining - a[i]);
    }
public:
    bool canPartition(vector<int>& nums) {
        int sum = accumulate(nums.begin(), nums.end(), 0);
        if (sum % 2) return false;
        memo.assign(nums.size(), vector<int>(sum / 2 + 1, -1));
        return can(nums, 0, sum / 2);
    }
};
