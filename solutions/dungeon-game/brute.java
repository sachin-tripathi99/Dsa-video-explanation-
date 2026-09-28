class Solution {
    public int calculateMinimumHP(int[][] dungeon) {
        return need(dungeon, 0, 0);
    }

    private int need(int[][] d, int r, int c) {             // health needed on entering (r, c)
        int R = d.length, C = d[0].length;
        if (r >= R || c >= C) return Integer.MAX_VALUE;
        int next = (r == R - 1 && c == C - 1) ? 1 : Math.min(need(d, r + 1, c), need(d, r, c + 1));
        return Math.max(1, next - d[r][c]);
    }
}
