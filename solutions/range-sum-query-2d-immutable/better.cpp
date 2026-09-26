class NumMatrix {
    vector<vector<int>> row;                  // row[r][c] = sum of m[r][0..c−1]
public:
    NumMatrix(vector<vector<int>>& matrix) {
        int R = matrix.size(), C = matrix[0].size();
        row.assign(R, vector<int>(C + 1, 0));
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++) row[r][c + 1] = row[r][c] + matrix[r][c];
    }

    int sumRegion(int row1, int col1, int row2, int col2) {
        int s = 0;
        for (int r = row1; r <= row2; r++) s += row[r][col2 + 1] - row[r][col1];
        return s;
    }
};
