class Solution {
public:
    int uniquePathsWithObstacles(vector<vector<int>>& obstacleGrid) {
        int n = obstacleGrid[0].size();
        vector<long long> row(n, 0);
        row[0] = 1;                                         // the start (reset below if blocked)
        for (auto& g : obstacleGrid)
            for (int c = 0; c < n; c++) {
                if (g[c] == 1) row[c] = 0;                  // rock: no paths
                else if (c > 0) row[c] += row[c - 1];       // above (old) + left (new)
            }
        return row[n - 1];
    }
};
