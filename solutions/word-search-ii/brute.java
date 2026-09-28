class Solution {
    public List<String> findWords(char[][] board, String[] words) {
        List<String> res = new ArrayList<>();
        for (String w : words) {                            // a full search per word
            boolean found = false;
            for (int r = 0; r < board.length && !found; r++)
                for (int c = 0; c < board[0].length && !found; c++)
                    found = dfs(board, w, r, c, 0);
            if (found) res.add(w);
        }
        return res;
    }

    private boolean dfs(char[][] b, String w, int r, int c, int i) {
        if (i == w.length()) return true;
        if (r < 0 || c < 0 || r >= b.length || c >= b[0].length || b[r][c] != w.charAt(i)) return false;
        char tmp = b[r][c];
        b[r][c] = '#';                                      // mark used
        boolean ok = dfs(b, w, r + 1, c, i + 1) || dfs(b, w, r - 1, c, i + 1) || dfs(b, w, r, c + 1, i + 1) || dfs(b, w, r, c - 1, i + 1);
        b[r][c] = tmp;
        return ok;
    }
}
