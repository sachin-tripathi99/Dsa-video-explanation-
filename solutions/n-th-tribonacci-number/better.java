class Solution {
    private final int[] memo = new int[38];

    public int tribonacci(int n) {
        if (n == 0) return 0;
        if (n <= 2) return 1;
        if (memo[n] != 0) return memo[n];                   // solved before
        return memo[n] = tribonacci(n - 1) + tribonacci(n - 2) + tribonacci(n - 3);
    }
}
