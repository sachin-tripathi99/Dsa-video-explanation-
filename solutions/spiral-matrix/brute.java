class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        boolean[][] seen = new boolean[m][n];
        int[] dr = {0, 1, 0, -1}, dc = {1, 0, -1, 0};      // right, down, left, up
        List<Integer> out = new ArrayList<>();
        int r = 0, c = 0, d = 0;
        for (int k = 0; k < m * n; k++) {
            out.add(matrix[r][c]);
            seen[r][c] = true;
            int nr = r + dr[d], nc = c + dc[d];
            if (nr < 0 || nr >= m || nc < 0 || nc >= n || seen[nr][nc]) {
                d = (d + 1) % 4;                            // turn right
                nr = r + dr[d];
                nc = c + dc[d];
            }
            r = nr;
            c = nc;
        }
        return out;
    }
}
