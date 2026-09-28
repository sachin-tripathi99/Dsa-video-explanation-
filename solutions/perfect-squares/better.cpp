class Solution {
    vector<int> memo;
    int fewest(int n) {
        if (n == 0) return 0;
        if (memo[n]) return memo[n];                        // solved before
        int best = INT_MAX;
        for (int s = 1; s * s <= n; s++) best = min(best, 1 + fewest(n - s * s));
        return memo[n] = best;
    }
public:
    int numSquares(int n) {
        memo.assign(n + 1, 0);
        return fewest(n);
    }
};
