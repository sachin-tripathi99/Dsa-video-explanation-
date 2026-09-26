class Solution {
    public void gameOfLife(int[][] board) {
        int m = board.length, n = board[0].length;
        int[][] next = new int[m][n];
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++) {
                int live = 0;
                for (int dr = -1; dr <= 1; dr++)
                    for (int dc = -1; dc <= 1; dc++) {
                        int nr = r + dr, nc = c + dc;
                        if ((dr != 0 || dc != 0) && nr >= 0 && nr < m && nc >= 0 && nc < n) live += board[nr][nc];
                    }
                next[r][c] = board[r][c] == 1 ? (live == 2 || live == 3 ? 1 : 0) : (live == 3 ? 1 : 0);
            }
        for (int r = 0; r < m; r++) board[r] = next[r];
    }
}
