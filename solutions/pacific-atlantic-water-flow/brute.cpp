class Solution {
public:
    vector<vector<int>> pacificAtlantic(vector<vector<int>>& h) {
        int m = h.size(), n = h[0].size();
        vector<vector<int>> out;
        int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};
        for (int sr = 0; sr < m; sr++)
            for (int sc = 0; sc < n; sc++) {
                vector<vector<bool>> seen(m, vector<bool>(n, false));   // a full search per cell
                vector<pair<int, int>> st{{sr, sc}};
                seen[sr][sc] = true;
                bool pac = false, atl = false;
                while (!st.empty()) {
                    auto [r, c] = st.back(); st.pop_back();
                    if (r == 0 || c == 0) pac = true;
                    if (r == m - 1 || c == n - 1) atl = true;
                    for (int k = 0; k < 4; k++) {
                        int nr = r + dr[k], nc = c + dc[k];
                        if (nr < 0 || nc < 0 || nr >= m || nc >= n || seen[nr][nc] || h[nr][nc] > h[r][c]) continue;   // downhill only
                        seen[nr][nc] = true;
                        st.push_back({nr, nc});
                    }
                }
                if (pac && atl) out.push_back({sr, sc});
            }
        return out;
    }
};
