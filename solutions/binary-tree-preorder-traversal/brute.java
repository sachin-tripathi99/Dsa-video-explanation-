class Solution {
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        dfs(root, out);
        return out;
    }

    private void dfs(TreeNode node, List<Integer> out) {
        if (node == null) return;
        out.add(node.val);                                  // node
        dfs(node.left, out);                                // left
        dfs(node.right, out);                               // right
    }
}
