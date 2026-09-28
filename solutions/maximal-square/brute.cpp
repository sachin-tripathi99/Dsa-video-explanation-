class Solution {
public:
    int maximalSquare(vector<vector<char>>& matrix) {
        int R = matrix.size(), C = matrix[0].size(), best = 0;
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++) {
                if (matrix[r][c] != '1') continue;
                int k = 1;                                  // grow while the new edge is all 1s
                while (r + k < R && c + k < C) {
                    bool ok = true;
                    for (int i = 0; i <= k && ok; i++)
                        if (matrix[r + k][c + i] != '1' || matrix[r + i][c + k] != '1') ok = false;
                    if (!ok) break;
                    k++;
                }
                best = max(best, k);
            }
        return best * best;
    }
};
