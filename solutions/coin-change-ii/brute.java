class Solution {
    public int change(int amount, int[] coins) {
        return count(coins, 0, amount);
    }

    private int count(int[] coins, int i, int remaining) {
        if (remaining == 0) return 1;
        if (i == coins.length || remaining < 0) return 0;
        return count(coins, i + 1, remaining) + count(coins, i, remaining - coins[i]);   // done with coin i, or one more
    }
}
