class Solution {
    public int countArrangement(int n) {
        int[] dp = new int[1 << n];
        dp[0] = 1;
        for (int mask = 1; mask < (1 << n); mask++) {
            int pos = Integer.bitCount(mask);               // the position being filled
            for (int i = 0; i < n; i++)
                if ((mask >> i & 1) == 1 && ((i + 1) % pos == 0 || pos % (i + 1) == 0))
                    dp[mask] += dp[mask ^ (1 << i)];        // number i+1 sits at pos
        }
        return dp[(1 << n) - 1];
    }
}
