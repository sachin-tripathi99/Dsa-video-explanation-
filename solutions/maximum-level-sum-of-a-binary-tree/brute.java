class Solution {
    private final List<Long> sums = new ArrayList<>();

    public int maxLevelSum(TreeNode root) {
        dfs(root, 0);
        int best = 0;
        for (int d = 1; d < sums.size(); d++) if (sums.get(d) > sums.get(best)) best = d;
        return best + 1;
    }

    private void dfs(TreeNode n, int d) {
        if (n == null) return;
        if (d == sums.size()) sums.add(0L);
        sums.set(d, sums.get(d) + n.val);
        dfs(n.left, d + 1);
        dfs(n.right, d + 1);
    }
}
