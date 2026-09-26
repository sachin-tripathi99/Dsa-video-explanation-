class Solution {
    private final List<String> out = new ArrayList<>();
    private final List<Integer> path = new ArrayList<>();

    public List<String> binaryTreePaths(TreeNode root) {
        dfs(root);
        return out;
    }

    private void dfs(TreeNode node) {
        if (node == null) return;
        path.add(node.val);                                 // choose
        if (node.left == null && node.right == null) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < path.size(); i++) { if (i > 0) sb.append("->"); sb.append(path.get(i)); }
            out.add(sb.toString());                         // build a string only at leaves
        }
        dfs(node.left);
        dfs(node.right);
        path.remove(path.size() - 1);                       // un-choose
    }
}
