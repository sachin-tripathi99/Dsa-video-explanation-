class Solution {
    public int shortestBridge(int[][] grid) {
        int n = grid.length;
        int[][] label = new int[n][n];
        int k = 0;
        for (int r = 0; r < n; r++) for (int c = 0; c < n; c++) if (grid[r][c] == 1 && label[r][c] == 0) fill(grid, label, r, c, ++k);
        List<int[]> a = new ArrayList<>(), b = new ArrayList<>();
        for (int r = 0; r < n; r++) for (int c = 0; c < n; c++) { if (label[r][c] == 1) a.add(new int[]{r, c}); if (label[r][c] == 2) b.add(new int[]{r, c}); }
        int best = Integer.MAX_VALUE;
        for (int[] p : a) for (int[] q : b) best = Math.min(best, Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) - 1);   // every pair
        return best;
    }

    private void fill(int[][] g, int[][] label, int r, int c, int k) {
        if (r < 0 || c < 0 || r >= g.length || c >= g.length || g[r][c] != 1 || label[r][c] != 0) return;
        label[r][c] = k;
        fill(g, label, r + 1, c, k); fill(g, label, r - 1, c, k); fill(g, label, r, c + 1, k); fill(g, label, r, c - 1, k);
    }
}
