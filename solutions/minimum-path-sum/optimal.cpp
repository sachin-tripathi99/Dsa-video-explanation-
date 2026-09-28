class Solution {
public:
    int minPathSum(vector<vector<int>>& grid) {
        int n = grid[0].size();
        vector<int> row(n, INT_MAX);
        row[0] = 0;
        for (auto& g : grid)
            for (int c = 0; c < n; c++)
                row[c] = g[c] + (c > 0 ? min(row[c], row[c - 1]) : row[c]);   // min(up, left)
        return row[n - 1];
    }
};
