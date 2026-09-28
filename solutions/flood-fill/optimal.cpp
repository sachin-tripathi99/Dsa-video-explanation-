class Solution {
    void fill(vector<vector<int>>& g, int r, int c, int old, int color) {
        if (r < 0 || c < 0 || r >= (int)g.size() || c >= (int)g[0].size() || g[r][c] != old) return;
        g[r][c] = color;                                    // recolour = visited
        fill(g, r + 1, c, old, color); fill(g, r - 1, c, old, color);
        fill(g, r, c + 1, old, color); fill(g, r, c - 1, old, color);
    }
public:
    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {
        int old = image[sr][sc];
        if (old != color) fill(image, sr, sc, old, color);  // same colour: nothing to do
        return image;
    }
};
