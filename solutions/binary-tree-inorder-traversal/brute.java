class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        dfs(root, out);
        return out;
    }

    private void dfs(TreeNode node, List<Integer> out) {
        if (node == null) return;
        dfs(node.left, out);                                // left
        out.add(node.val);                                  // node
        dfs(node.right, out);                               // right
    }
}
