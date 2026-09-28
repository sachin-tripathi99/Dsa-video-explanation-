class Solution {
    private int[][] memo;

    public int minInsertions(String s) {
        memo = new int[s.length()][s.length()];
        for (int[] row : memo) Arrays.fill(row, -1);
        return ins(s, 0, s.length() - 1);
    }

    private int ins(String s, int i, int j) {
        if (i >= j) return 0;
        if (memo[i][j] >= 0) return memo[i][j];             // solved before
        if (s.charAt(i) == s.charAt(j)) return memo[i][j] = ins(s, i + 1, j - 1);
        return memo[i][j] = 1 + Math.min(ins(s, i + 1, j), ins(s, i, j - 1));
    }
}
