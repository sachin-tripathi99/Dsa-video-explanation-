class Solution {
    private Integer[][] memo;
    private int half;

    public int lastStoneWeightII(int[] stones) {
        int total = 0;
        for (int x : stones) total += x;
        half = total / 2;
        memo = new Integer[stones.length + 1][half + 1];
        return total - 2 * best(stones, 0, 0);
    }

    private int best(int[] a, int i, int sum) {             // largest reachable sum ≤ half
        if (i == a.length) return sum;
        if (memo[i][sum] != null) return memo[i][sum];      // solved before
        int r = best(a, i + 1, sum);
        if (sum + a[i] <= half) r = Math.max(r, best(a, i + 1, sum + a[i]));
        return memo[i][sum] = r;
    }
}
