class Solution {
    public int[][] floodFill(int[][] image, int sr, int sc, int color) {
        int old = image[sr][sc];
        if (old == color) return image;
        int m = image.length, n = image[0].length;
        boolean[][] painted = new boolean[m][n];
        painted[sr][sc] = true;
        boolean changed = true;
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
}
