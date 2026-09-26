class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        List<TreeNode> a = new ArrayList<>(), b = new ArrayList<>();
        path(root, p, a);
        path(root, q, b);
        TreeNode lca = null;
        for (int i = 0; i < Math.min(a.size(), b.size()) && a.get(i) == b.get(i); i++) lca = a.get(i);
        return lca;
    }

    private boolean path(TreeNode node, TreeNode target, List<TreeNode> out) {   // root → target
        if (node == null) return false;
        out.add(node);
        if (node == target || path(node.left, target, out) || path(node.right, target, out)) return true;
        out.remove(out.size() - 1);
        return false;
    }
}
