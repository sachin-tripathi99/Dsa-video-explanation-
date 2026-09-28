class Solution {
    int fall(vector<vector<int>>& a, int r, int c) {
        int n = a.size();
        if (c < 0 || c >= n) return INT_MAX;                // off the edge
        if (r == n - 1) return a[r][c];
        return a[r][c] + min({fall(a, r + 1, c - 1), fall(a, r + 1, c), fall(a, r + 1, c + 1)});
    }
public:
    int minFallingPathSum(vector<vector<int>>& matrix) {
        int best = INT_MAX;
        for (int c = 0; c < (int)matrix.size(); c++) best = min(best, fall(matrix, 0, c));
        return best;
    }
};
