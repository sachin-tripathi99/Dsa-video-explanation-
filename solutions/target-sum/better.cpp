class Solution {
    vector<vector<int>> memo;
    int offset;
    int count(vector<int>& a, int i, int sum, int target) {
        if (i == (int)a.size()) return sum == target ? 1 : 0;
        int& m = memo[i][sum + offset];
        if (m != -1) return m;                              // solved before
        return m = count(a, i + 1, sum + a[i], target) + count(a, i + 1, sum - a[i], target);
    }
public:
    int findTargetSumWays(vector<int>& nums, int target) {
        offset = accumulate(nums.begin(), nums.end(), 0);
        memo.assign(nums.size(), vector<int>(2 * offset + 1, -1));
        return count(nums, 0, 0, target);
    }
};
