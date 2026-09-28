class Solution {
    private int[] memo, pts;

    public int deleteAndEarn(int[] nums) {
        int max = 0;
        for (int x : nums) max = Math.max(max, x);
        pts = new int[max + 1];
        for (int x : nums) pts[x] += x;
        memo = new int[max + 1];
        Arrays.fill(memo, -1);
        return best(max);
    }

    private int best(int x) {
        if (x < 0) return 0;
        if (memo[x] >= 0) return memo[x];                   // solved before
        return memo[x] = Math.max(best(x - 1), best(x - 2) + pts[x]);
    }
}
