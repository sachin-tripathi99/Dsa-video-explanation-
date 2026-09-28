class Solution {
    public int lastStoneWeightII(int[] stones) {
        int total = 0;
        for (int x : stones) total += x;
        int half = total / 2;
        boolean[] dp = new boolean[half + 1];               // dp[s]: a group can weigh s
        dp[0] = true;
        for (int x : stones)
            for (int c = half; c >= x; c--) dp[c] |= dp[c - x];
        for (int s = half; ; s--) if (dp[s]) return total - 2 * s;   // closest to half
    }
}
