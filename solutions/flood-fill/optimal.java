class Solution {
    public int[][] floodFill(int[][] image, int sr, int sc, int color) {
        int old = image[sr][sc];
        if (old != color) fill(image, sr, sc, old, color);  // same colour: nothing to do
        return image;
    }

    private void fill(int[][] g, int r, int c, int old, int color) {
        if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] != old) return;
        g[r][c] = color;                                    // recolour = visited
        fill(g, r + 1, c, old, color); fill(g, r - 1, c, old, color);
        fill(g, r, c + 1, old, color); fill(g, r, c - 1, old, color);
    }
}
