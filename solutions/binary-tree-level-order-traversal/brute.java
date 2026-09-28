class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> out = new ArrayList<>();
        dfs(root, 0, out);
        return out;
    }

    private void dfs(TreeNode n, int depth, List<List<Integer>> out) {
        if (n == null) return;
        if (depth == out.size()) out.add(new ArrayList<>());   // first node at this depth
        out.get(depth).add(n.val);
        dfs(n.left, depth + 1, out);
        dfs(n.right, depth + 1, out);
    }
}
