class Solution {
    private final List<Double> sum = new ArrayList<>();
    private final List<Integer> cnt = new ArrayList<>();

    public List<Double> averageOfLevels(TreeNode root) {
        dfs(root, 0);
        List<Double> out = new ArrayList<>();
        for (int d = 0; d < sum.size(); d++) out.add(sum.get(d) / cnt.get(d));
        return out;
    }

    private void dfs(TreeNode n, int d) {
        if (n == null) return;
        if (d == sum.size()) { sum.add(0.0); cnt.add(0); }
        sum.set(d, sum.get(d) + n.val);
        cnt.set(d, cnt.get(d) + 1);
        dfs(n.left, d + 1);
        dfs(n.right, d + 1);
    }
}
