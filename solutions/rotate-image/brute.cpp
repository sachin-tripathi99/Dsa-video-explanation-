class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {
        int n = matrix.size();
        vector<vector<int>> out(n, vector<int>(n));
        for (int r = 0; r < n; r++)
            for (int c = 0; c < n; c++) out[c][n - 1 - r] = matrix[r][c];
        matrix = out;
    }
};
