class Solution {
    private int[] memo;

    public int climbStairs(int n) {
        memo = new int[n + 1];
        return ways(n);
    }

    private int ways(int n) {
        if (n <= 1) return 1;
        if (memo[n] != 0) return memo[n];                   // solved before
        return memo[n] = ways(n - 1) + ways(n - 2);
    }
}
