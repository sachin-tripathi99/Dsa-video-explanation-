class Solution {
    public int minimumTotal(List<List<Integer>> triangle) {
        int n = triangle.size();
        int[] dp = new int[n + 1];                          // cheapest from the row below
        for (int r = n - 1; r >= 0; r--)
            for (int c = 0; c <= r; c++)
                dp[c] = triangle.get(r).get(c) + Math.min(dp[c], dp[c + 1]);
        return dp[0];
    }
}
