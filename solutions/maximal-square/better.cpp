class Solution {
    vector<vector<int>> memo;
    int side(vector<vector<char>>& m, int r, int c) {       // largest square ending at (r, c)
        if (r < 0 || c < 0 || m[r][c] != '1') return 0;
        if (memo[r][c] >= 0) return memo[r][c];
        return memo[r][c] = 1 + min({side(m, r - 1, c), side(m, r, c - 1), side(m, r - 1, c - 1)});
    }
public:
    int maximalSquare(vector<vector<char>>& matrix) {
        memo.assign(matrix.size(), vector<int>(matrix[0].size(), -1));
        int best = 0;
        for (int r = 0; r < (int)matrix.size(); r++)
            for (int c = 0; c < (int)matrix[0].size(); c++) best = max(best, side(matrix, r, c));
        return best * best;
    }
};
