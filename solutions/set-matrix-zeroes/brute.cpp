class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();
        auto copy = matrix;
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                if (copy[r][c] == 0) {
                    for (int k = 0; k < n; k++) matrix[r][k] = 0;
                    for (int k = 0; k < m; k++) matrix[k][c] = 0;
                }
    }
};
