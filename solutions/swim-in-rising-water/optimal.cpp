class Solution {
public:
    int swimInWater(vector<vector<int>>& grid) {
        int n = grid.size();
        vector<vector<int>> time(n, vector<int>(n, INT_MAX));
        time[0][0] = grid[0][0];
        priority_queue<array<int, 3>, vector<array<int, 3>>, greater<>> pq;
        pq.push({grid[0][0], 0, 0});
        int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};
        while (!pq.empty()) {
            auto [d, r, c] = pq.top(); pq.pop();
            if (d > time[r][c]) continue;                   // stale
            if (r == n - 1 && c == n - 1) return d;         // popped = final
            for (int k = 0; k < 4; k++) {
                int nr = r + dr[k], nc = c + dc[k];
                if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
                int x = max(d, grid[nr][nc]);               // highest cell on the route
                if (x < time[nr][nc]) { time[nr][nc] = x; pq.push({x, nr, nc}); }
            }
        }
        return -1;
    }
};
