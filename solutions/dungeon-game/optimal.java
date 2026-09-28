class Solution {
    public int calculateMinimumHP(int[][] dungeon) {
        int R = dungeon.length, C = dungeon[0].length;
        int[] need = new int[C + 1];
        Arrays.fill(need, Integer.MAX_VALUE);
        need[C - 1] = 1;                                    // after the princess: 1 health
        for (int r = R - 1; r >= 0; r--)
            for (int c = C - 1; c >= 0; c--)
                need[c] = Math.max(1, Math.min(need[c], need[c + 1]) - dungeon[r][c]);   // min(down, right)
        return need[0];
    }
}
