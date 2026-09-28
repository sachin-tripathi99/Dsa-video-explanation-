class Solution {
    private int[][] h;
    private int m, n;
    private boolean pac, atl;

    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        h = heights; m = h.length; n = h[0].length;
        List<List<Integer>> out = new ArrayList<>();
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++) {
                pac = atl = false;
                flow(r, c, new boolean[m][n]);              // a full search per cell
                if (pac && atl) out.add(List.of(r, c));
            }
        return out;
    }

    private void flow(int r, int c, boolean[][] seen) {
        if (seen[r][c]) return;
        seen[r][c] = true;
        if (r == 0 || c == 0) pac = true;
        if (r == m - 1 || c == n - 1) atl = true;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nc >= 0 && nr < m && nc < n && h[nr][nc] <= h[r][c]) flow(nr, nc, seen);   // downhill
        }
    }
}
