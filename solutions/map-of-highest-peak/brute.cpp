class Solution {
public:
    vector<vector<int>> highestPeak(vector<vector<int>>& isWater) {
        int m = isWater.size(), n = isWater[0].size();
        vector<vector<int>> h(m, vector<int>(n, 0));
        int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};
        for (int sr = 0; sr < m; sr++)
            for (int sc = 0; sc < n; sc++) {
                vector<vector<bool>> seen(m, vector<bool>(n, false));   // fresh BFS per cell
                queue<array<int, 3>> q;
                q.push({sr, sc, 0});
                seen[sr][sc] = true;
                while (!q.empty()) {
                    auto [r, c, d] = q.front(); q.pop();
                    if (isWater[r][c]) { h[sr][sc] = d; break; }
                    for (int k = 0; k < 4; k++) {
                        int nr = r + dr[k], nc = c + dc[k];
                        if (nr < 0 || nc < 0 || nr >= m || nc >= n || seen[nr][nc]) continue;
                        seen[nr][nc] = true;
                        q.push({nr, nc, d + 1});
                    }
                }
            }
        return h;
    }
};
