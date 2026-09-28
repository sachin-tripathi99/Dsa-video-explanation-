class Solution {
    vector<vector<int>> memo;
    int paths(int r, int c) {
        if (r == 0 || c == 0) return 1;
        if (memo[r][c]) return memo[r][c];                  // solved before
        return memo[r][c] = paths(r - 1, c) + paths(r, c - 1);
    }
public:
    int uniquePaths(int m, int n) {
        memo.assign(m, vector<int>(n, 0));
        return paths(m - 1, n - 1);
    }
};
