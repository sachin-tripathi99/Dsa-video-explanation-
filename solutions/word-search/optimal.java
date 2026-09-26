class Solution {
    public boolean exist(char[][] board, String word) {
        for (int r = 0; r < board.length; r++)
            for (int c = 0; c < board[0].length; c++)
                if (dfs(board, word, r, c, 0)) return true;
        return false;
    }

    private boolean dfs(char[][] b, String w, int r, int c, int k) {
        if (r < 0 || c < 0 || r >= b.length || c >= b[0].length || b[r][c] != w.charAt(k)) return false;   // mismatch or used
        if (k == w.length() - 1) return true;
        char saved = b[r][c];
        b[r][c] = '#';                                      // mark as used
        boolean ok = dfs(b, w, r + 1, c, k + 1) || dfs(b, w, r - 1, c, k + 1)
                  || dfs(b, w, r, c + 1, k + 1) || dfs(b, w, r, c - 1, k + 1);
        b[r][c] = saved;                                    // unmark
        return ok;
    }
}
