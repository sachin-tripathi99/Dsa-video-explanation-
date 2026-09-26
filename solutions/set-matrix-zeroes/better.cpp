class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();
        vector<bool> zeroRow(m, false), zeroCol(n, false);
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                if (matrix[r][c] == 0) zeroRow[r] = zeroCol[c] = true;
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                if (zeroRow[r] || zeroCol[c]) matrix[r][c] = 0;
    }
};
