class Solution {
    private int[][] h;
    private int m, n;

    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        h = heights; m = h.length; n = h[0].length;
        boolean[][] pac = new boolean[m][n], atl = new boolean[m][n];
        for (int r = 0; r < m; r++) { climb(r, 0, pac); climb(r, n - 1, atl); }
        for (int c = 0; c < n; c++) { climb(0, c, pac); climb(m - 1, c, atl); }
        List<List<Integer>> out = new ArrayList<>();
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++) if (pac[r][c] && atl[r][c]) out.add(List.of(r, c));
        return out;
    }

    private void climb(int r, int c, boolean[][] seen) {   // uphill from the ocean
        if (seen[r][c]) return;
        seen[r][c] = true;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nc >= 0 && nr < m && nc < n && h[nr][nc] >= h[r][c]) climb(nr, nc, seen);
        }
    }
}
