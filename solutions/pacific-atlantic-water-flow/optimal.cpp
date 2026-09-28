class Solution {
    int m, n;
    void climb(vector<vector<int>>& h, int r, int c, vector<vector<bool>>& seen) {   // uphill from the ocean
        if (seen[r][c]) return;
        seen[r][c] = true;
        int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};
        for (int k = 0; k < 4; k++) {
            int nr = r + dr[k], nc = c + dc[k];
            if (nr >= 0 && nc >= 0 && nr < m && nc < n && h[nr][nc] >= h[r][c]) climb(h, nr, nc, seen);
        }
    }
public:
    vector<vector<int>> pacificAtlantic(vector<vector<int>>& h) {
        m = h.size(); n = h[0].size();
        vector<vector<bool>> pac(m, vector<bool>(n, false)), atl = pac;
        for (int r = 0; r < m; r++) { climb(h, r, 0, pac); climb(h, r, n - 1, atl); }
        for (int c = 0; c < n; c++) { climb(h, 0, c, pac); climb(h, m - 1, c, atl); }
        vector<vector<int>> out;
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++) if (pac[r][c] && atl[r][c]) out.push_back({r, c});
        return out;
    }
};
