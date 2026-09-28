class Solution {
    bool reach(vector<vector<int>>& h, int limit) {
        int R = h.size(), C = h[0].size();
        vector<vector<bool>> seen(R, vector<bool>(C, false));
        queue<pair<int, int>> q;
        q.push({0, 0});
        seen[0][0] = true;
        int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};
        while (!q.empty()) {
            auto [r, c] = q.front(); q.pop();
            if (r == R - 1 && c == C - 1) return true;
            for (int k = 0; k < 4; k++) {
                int nr = r + dr[k], nc = c + dc[k];
                if (nr < 0 || nc < 0 || nr >= R || nc >= C || seen[nr][nc] || abs(h[nr][nc] - h[r][c]) > limit) continue;
                seen[nr][nc] = true;
                q.push({nr, nc});
            }
        }
        return false;
    }
public:
    int minimumEffortPath(vector<vector<int>>& heights) {
        int lo = 0, hi = 1000000;
        while (lo < hi) {                                   // smallest limit that works
            int mid = lo + (hi - lo) / 2;
            if (reach(heights, mid)) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }
};
