class Solution {
    vector<int> memo;
    int ways(int n) {
        if (n <= 1) return 1;
        if (memo[n]) return memo[n];                        // solved before
        return memo[n] = ways(n - 1) + ways(n - 2);
    }
public:
    int climbStairs(int n) {
        memo.assign(n + 1, 0);
        return ways(n);
    }
};
