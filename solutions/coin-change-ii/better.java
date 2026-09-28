class Solution {
    private Integer[][] memo;

    public int change(int amount, int[] coins) {
        memo = new Integer[coins.length][amount + 1];
        return count(coins, 0, amount);
    }

    private int count(int[] coins, int i, int remaining) {
        if (remaining == 0) return 1;
        if (i == coins.length || remaining < 0) return 0;
        if (memo[i][remaining] != null) return memo[i][remaining];   // solved before
        return memo[i][remaining] = count(coins, i + 1, remaining) + count(coins, i, remaining - coins[i]);
    }
}
