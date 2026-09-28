class Solution {
    private final List<Integer> view = new ArrayList<>();

    public List<Integer> rightSideView(TreeNode root) {
        dfs(root, 0);
        return view;
    }

    private void dfs(TreeNode n, int depth) {
        if (n == null) return;
        if (depth == view.size()) view.add(n.val);          // first node at this depth
        dfs(n.right, depth + 1);                            // right first
        dfs(n.left, depth + 1);
    }
}
