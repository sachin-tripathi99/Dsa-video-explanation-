class NumMatrix {
    vector<vector<int>> m;
public:
    NumMatrix(vector<vector<int>>& matrix) : m(matrix) {}

    int sumRegion(int row1, int col1, int row2, int col2) {
        int s = 0;
        for (int r = row1; r <= row2; r++)
            for (int c = col1; c <= col2; c++) s += m[r][c];
        return s;
    }
};
