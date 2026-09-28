class Solution {
    private int[][] memo;

    public int calculateMinimumHP(int[][] dungeon) {
        memo = new int[dungeon.length][dungeon[0].length];
        return need(dungeon, 0, 0);
    }

    private int need(int[][] d, int r, int c) {
        int R = d.length, C = d[0].length;
        if (r >= R || c >= C) return Integer.MAX_VALUE;
        if (memo[r][c] != 0) return memo[r][c];             // solved before (need ≥ 1)
        int next = (r == R - 1 && c == C - 1) ? 1 : Math.min(need(d, r + 1, c), need(d, r, c + 1));
        return memo[r][c] = Math.max(1, next - d[r][c]);
    }
}
