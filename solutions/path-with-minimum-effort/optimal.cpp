class Solution {
public:
    int minimumEffortPath(vector<vector<int>>& heights) {
        int R = heights.size(), C = heights[0].size();
        vector<vector<int>> eff(R, vector<int>(C, INT_MAX));
        eff[0][0] = 0;
        priority_queue<array<int, 3>, vector<array<int, 3>>, greater<>> pq;
        pq.push({0, 0, 0});
        int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};
        while (!pq.empty()) {
            auto [d, r, c] = pq.top(); pq.pop();
            if (d > eff[r][c]) continue;                    // stale
            if (r == R - 1 && c == C - 1) return d;         // popped = final
            for (int k = 0; k < 4; k++) {
                int nr = r + dr[k], nc = c + dc[k];
                if (nr < 0 || nc < 0 || nr >= R || nc >= C) continue;
                int e = max(d, abs(heights[nr][nc] - heights[r][c]));   // worst step so far
                if (e < eff[nr][nc]) { eff[nr][nc] = e; pq.push({e, nr, nc}); }
            }
        }
        return 0;
    }
};
