class Solution {
    public int maxDistance(int[][] grid) {
        int n = grid.length;
        List<int[]> land = new ArrayList<>();
        for (int r = 0; r < n; r++) for (int c = 0; c < n; c++) if (grid[r][c] == 1) land.add(new int[]{r, c});
        if (land.isEmpty() || land.size() == n * n) return -1;
        int best = 0;
        for (int r = 0; r < n; r++)
            for (int c = 0; c < n; c++) {
                if (grid[r][c] == 1) continue;
                int near = Integer.MAX_VALUE;
                for (int[] l : land) near = Math.min(near, Math.abs(r - l[0]) + Math.abs(c - l[1]));   // every pair
                best = Math.max(best, near);
            }
        return best;
    }
}
