class Solution {
    public void flatten(TreeNode root) {
        List<TreeNode> nodes = new ArrayList<>();
        pre(root, nodes);
        for (int i = 0; i < nodes.size(); i++) {
            nodes.get(i).left = null;
            nodes.get(i).right = i + 1 < nodes.size() ? nodes.get(i + 1) : null;
        }
    }

    private void pre(TreeNode n, List<TreeNode> out) {
        if (n == null) return;
        out.add(n);
        pre(n.left, out);
        pre(n.right, out);
    }
}
