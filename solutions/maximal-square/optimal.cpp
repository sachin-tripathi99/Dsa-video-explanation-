class Solution {
public:
    int maximalSquare(vector<vector<char>>& matrix) {
        int C = matrix[0].size(), best = 0;
        vector<int> row(C + 1, 0);                          // row[c + 1] = dp for column c
        for (auto& line : matrix) {
            int diag = 0;                                   // dp[r − 1][c − 1]
            for (int c = 1; c <= C; c++) {
                int up = row[c];
                row[c] = line[c - 1] == '1' ? 1 + min({up, row[c - 1], diag}) : 0;
                diag = up;
                best = max(best, row[c]);
            }
        }
        return best * best;
    }
};
