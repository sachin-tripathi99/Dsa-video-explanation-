class Solution {
public:
    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {
        int old = image[sr][sc];
        if (old == color) return image;
        int m = image.size(), n = image[0].size();
        vector<vector<bool>> painted(m, vector<bool>(n, false));
        painted[sr][sc] = true;
        bool changed = true;
        while (changed) {                                   // sweep until nothing changes
            changed = false;
            for (int r = 0; r < m; r++)
                for (int c = 0; c < n; c++) {
                    if (painted[r][c] || image[r][c] != old) continue;
                    if ((r > 0 && painted[r - 1][c]) || (r + 1 < m && painted[r + 1][c]) || (c > 0 && painted[r][c - 1]) || (c + 1 < n && painted[r][c + 1])) {
                        painted[r][c] = true;
                        changed = true;
                    }
                }
        }
        for (int r = 0; r < m; r++) for (int c = 0; c < n; c++) if (painted[r][c]) image[r][c] = color;
        return image;
    }
};
