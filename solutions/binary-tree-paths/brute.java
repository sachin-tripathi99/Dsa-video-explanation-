class Solution {
    private final List<String> out = new ArrayList<>();

    public List<String> binaryTreePaths(TreeNode root) {
        dfs(root, "");
        return out;
    }

    private void dfs(TreeNode node, String s) {
        if (node == null) return;
        s = s.isEmpty() ? String.valueOf(node.val) : s + "->" + node.val;   // new string each call
        if (node.left == null && node.right == null) { out.add(s); return; }
        dfs(node.left, s);
        dfs(node.right, s);
    }
}
