class Solution {
public:
    vector<vector<int>> updateMatrix(vector<vector<int>>& mat) {
        int m = mat.size(), n = mat[0].size();
        vector<vector<int>> out(m, vector<int>(n, 0));
        int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};
        for (int sr = 0; sr < m; sr++)
            for (int sc = 0; sc < n; sc++) {
                if (mat[sr][sc] == 0) continue;
                vector<vector<int>> d(m, vector<int>(n, -1));   // fresh BFS per cell
                d[sr][sc] = 0;
                queue<pair<int, int>> q;
                q.push({sr, sc});
                while (!q.empty()) {
                    auto [r, c] = q.front(); q.pop();
                    if (mat[r][c] == 0) { out[sr][sc] = d[r][c]; break; }
                    for (int k = 0; k < 4; k++) {
                        int nr = r + dr[k], nc = c + dc[k];
                        if (nr < 0 || nc < 0 || nr >= m || nc >= n || d[nr][nc] != -1) continue;
                        d[nr][nc] = d[r][c] + 1;
                        q.push({nr, nc});
                    }
                }
            }
        return out;
    }
};
