class Solution {
public:
    vector<vector<int>> generate(int numRows) {
        vector<vector<int>> rows;
        for (int r = 0; r < numRows; r++) {
            vector<int> row;
            for (int c = 0; c <= r; c++) {
                long long v = 1;
                for (int k = 1; k <= c; k++) v = v * (r - k + 1) / k;   // C(r, c)
                row.push_back((int) v);
            }
            rows.push_back(row);
        }
        return rows;
    }
};
