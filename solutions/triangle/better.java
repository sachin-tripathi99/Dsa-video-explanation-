class Solution {
    private Integer[][] memo;

    public int minimumTotal(List<List<Integer>> triangle) {
        memo = new Integer[triangle.size()][triangle.size()];
        return best(triangle, 0, 0);
    }

    private int best(List<List<Integer>> t, int r, int c) {
        if (r == t.size() - 1) return t.get(r).get(c);
        if (memo[r][c] != null) return memo[r][c];          // solved before
        return memo[r][c] = t.get(r).get(c) + Math.min(best(t, r + 1, c), best(t, r + 1, c + 1));
    }
}
