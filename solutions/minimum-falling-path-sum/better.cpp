class Solution {
    vector<vector<int>> memo;
    vector<vector<bool>> seen;
    int fall(vector<vector<int>>& a, int r, int c) {
        int n = a.size();
        if (c < 0 || c >= n) return INT_MAX;
        if (r == n - 1) return a[r][c];
        if (seen[r][c]) return memo[r][c];                  // solved before
        seen[r][c] = true;
        return memo[r][c] = a[r][c] + min({fall(a, r + 1, c - 1), fall(a, r + 1, c), fall(a, r + 1, c + 1)});
    }
public:
    int minFallingPathSum(vector<vector<int>>& matrix) {
        int n = matrix.size();
        memo.assign(n, vector<int>(n, 0));
        seen.assign(n, vector<bool>(n, false));
        int best = INT_MAX;
        for (int c = 0; c < n; c++) best = min(best, fall(matrix, 0, c));
        return best;
    }
};
