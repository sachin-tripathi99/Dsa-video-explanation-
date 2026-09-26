class Solution {
    private final List<List<String>> out = new ArrayList<>();
    private boolean[] cols, d1, d2;
    private int[] q;

    public List<List<String>> solveNQueens(int n) {
        cols = new boolean[n]; d1 = new boolean[2 * n]; d2 = new boolean[2 * n]; q = new int[n];
        go(n, 0);
        return out;
    }

    private void go(int n, int r) {
        if (r == n) {
            List<String> board = new ArrayList<>();
            for (int c : q) { char[] row = new char[n]; Arrays.fill(row, '.'); row[c] = 'Q'; board.add(new String(row)); }
            out.add(board);
            return;
        }
        for (int c = 0; c < n; c++) {
            if (cols[c] || d1[r - c + n] || d2[r + c]) continue;   // attacked
            cols[c] = d1[r - c + n] = d2[r + c] = true; q[r] = c;
            go(n, r + 1);
            cols[c] = d1[r - c + n] = d2[r + c] = false;
        }
    }
}
