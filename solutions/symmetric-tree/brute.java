class Solution {
    private TreeNode mirrorCopy(TreeNode n) {
        if (n == null) return null;
        TreeNode c = new TreeNode(n.val);
        c.left = mirrorCopy(n.right);
        c.right = mirrorCopy(n.left);
        return c;
    }

    private boolean same(TreeNode a, TreeNode b) {
        if (a == null || b == null) return a == b;
        return a.val == b.val && same(a.left, b.left) && same(a.right, b.right);
    }

    public boolean isSymmetric(TreeNode root) {
        return same(root, mirrorCopy(root));
    }
}
