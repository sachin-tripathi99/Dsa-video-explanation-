class Solution {
    private int[][] memo;

    public int numDistinct(String s, String t) {
        memo = new int[s.length()][t.length()];
        for (int[] row : memo) Arrays.fill(row, -1);
        return ways(s, t, 0, 0);
    }

    private int ways(String s, String t, int i, int j) {
        if (j == t.length()) return 1;
        if (i == s.length()) return 0;
        if (memo[i][j] >= 0) return memo[i][j];             // solved before
        int res = ways(s, t, i + 1, j);
        if (s.charAt(i) == t.charAt(j)) res += ways(s, t, i + 1, j + 1);
        return memo[i][j] = res;
    }
}
