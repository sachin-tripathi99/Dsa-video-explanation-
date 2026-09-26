class Solution {
    public void solveSudoku(char[][] board) {
        go(board);
    }

    private boolean go(char[][] b) {
        for (int r = 0; r < 9; r++)
            for (int c = 0; c < 9; c++) {
                if (b[r][c] != '.') continue;               // first empty cell
                for (char d = '1'; d <= '9'; d++) {
                    if (!ok(b, r, c, d)) continue;
                    b[r][c] = d;
                    if (go(b)) return true;
                    b[r][c] = '.';                          // undo
                }
                return false;
            }
        return true;
    }

    private boolean ok(char[][] b, int r, int c, char d) {  // scan row, column and box
        for (int k = 0; k < 9; k++) {
            if (b[r][k] == d || b[k][c] == d) return false;
            if (b[3 * (r / 3) + k / 3][3 * (c / 3) + k % 3] == d) return false;
        }
        return true;
    }
}
