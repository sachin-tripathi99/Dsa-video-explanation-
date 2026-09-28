class Solution {
    private Integer[][][] memo;
    private int[][] cost;

    public int findMaxForm(String[] strs, int m, int n) {
        cost = new int[strs.length][2];
        for (int i = 0; i < strs.length; i++)
            for (char c : strs[i].toCharArray()) cost[i][c - '0']++;
        memo = new Integer[strs.length][m + 1][n + 1];
        return best(0, m, n);
    }

    private int best(int i, int z, int o) {
        if (i == cost.length) return 0;
        if (memo[i][z][o] != null) return memo[i][z][o];    // solved before
        int res = best(i + 1, z, o);
        if (cost[i][0] <= z && cost[i][1] <= o) res = Math.max(res, 1 + best(i + 1, z - cost[i][0], o - cost[i][1]));
        return memo[i][z][o] = res;
    }
}
