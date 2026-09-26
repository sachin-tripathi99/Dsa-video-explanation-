class Solution {
    private final List<List<Integer>> out = new ArrayList<>();
    private final List<Integer> path = new ArrayList<>();

    public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
        dfs(root, targetSum);
        return out;
    }

    private void dfs(TreeNode n, int remain) {
        if (n == null) return;
        path.add(n.val);
        remain -= n.val;
        if (n.left == null && n.right == null && remain == 0) out.add(new ArrayList<>(path));   // copy matches only
        dfs(n.left, remain);
        dfs(n.right, remain);
        path.remove(path.size() - 1);
    }
}
