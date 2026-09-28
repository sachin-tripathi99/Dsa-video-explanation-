class Solution {
    public void solve(char[][] board) {
        int m = board.length, n = board[0].length;
        for (int r = 0; r < m; r++) { mark(board, r, 0); mark(board, r, n - 1); }   // border O cells
        for (int c = 0; c < n; c++) { mark(board, 0, c); mark(board, m - 1, c); }
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                board[r][c] = board[r][c] == 'S' ? 'O' : 'X';   // safe stays, the rest is captured
    }

    private void mark(char[][] b, int r, int c) {
        if (r < 0 || c < 0 || r >= b.length || c >= b[0].length || b[r][c] != 'O') return;
        b[r][c] = 'S';                                      // reachable from the border
        mark(b, r + 1, c); mark(b, r - 1, c); mark(b, r, c + 1); mark(b, r, c - 1);
    }
}
