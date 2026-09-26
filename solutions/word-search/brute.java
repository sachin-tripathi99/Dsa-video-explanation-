class Solution {
    private char[][] b;
    private String w;
    private boolean[][] used;

    public boolean exist(char[][] board, String word) {
        b = board; w = word;
        used = new boolean[b.length][b[0].length];
        for (int r = 0; r < b.length; r++)
            for (int c = 0; c < b[0].length; c++)
                if (walk(r, c, new StringBuilder())) return true;
        return false;
    }

    private boolean walk(int r, int c, StringBuilder sb) {  // build a whole path, compare only at the end
        if (r < 0 || c < 0 || r >= b.length || c >= b[0].length || used[r][c]) return false;
        sb.append(b[r][c]);
        used[r][c] = true;
        boolean ok;
        if (sb.length() == w.length()) ok = sb.toString().equals(w);
        else ok = walk(r + 1, c, sb) || walk(r - 1, c, sb) || walk(r, c + 1, sb) || walk(r, c - 1, sb);
        used[r][c] = false;
        sb.deleteCharAt(sb.length() - 1);
        return ok;
    }
}
