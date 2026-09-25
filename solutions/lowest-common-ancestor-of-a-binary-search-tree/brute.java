class Solution {
    private List<TreeNode> path(TreeNode root, TreeNode target) {
        List<TreeNode> out = new ArrayList<>();
        TreeNode n = root;
        while (n != null) {
            out.add(n);
            if (n == target) break;
            n = target.val < n.val ? n.left : n.right;
        }
        return out;
    }

    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        List<TreeNode> a = path(root, p), b = path(root, q);
        TreeNode lca = root;
        for (int i = 0; i < Math.min(a.size(), b.size()) && a.get(i) == b.get(i); i++) lca = a.get(i);
        return lca;
    }
}
