class Solution {
    private final List<List<String>> out = new ArrayList<>();

    public List<List<String>> solveNQueens(int n) {
        perm(n, new int[n], new boolean[n], 0);
        return out;
    }

    private void perm(int n, int[] q, boolean[] used, int r) {   // every column permutation
        if (r == n) {
            for (int a = 0; a < n; a++)
                for (int b = a + 1; b < n; b++)
                    if (Math.abs(q[a] - q[b]) == b - a) return;  // shared diagonal
            List<String> board = new ArrayList<>();
            for (int c : q) { char[] row = new char[n]; Arrays.fill(row, '.'); row[c] = 'Q'; board.add(new String(row)); }
            out.add(board);
            return;
        }
        for (int c = 0; c < n; c++) {
            if (used[c]) continue;
            used[c] = true; q[r] = c;
            perm(n, q, used, r + 1);
            used[c] = false;
        }
    }
}
