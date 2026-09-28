class Solution {
    public int findMaxForm(String[] strs, int m, int n) {
        int[][] dp = new int[m + 1][n + 1];                 // dp[z][o]: most strings within budgets
        for (String s : strs) {
            int zs = 0, os = 0;
            for (char c : s.toCharArray()) { if (c == '0') zs++; else os++; }
            for (int z = m; z >= zs; z--)                   // both budgets high → low
                for (int o = n; o >= os; o--) dp[z][o] = Math.max(dp[z][o], dp[z - zs][o - os] + 1);
        }
        return dp[m][n];
    }
}
