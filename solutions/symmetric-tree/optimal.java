class Solution {
    private boolean mirror(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null || a.val != b.val) return false;
        return mirror(a.left, b.right) && mirror(a.right, b.left);   // outer, inner
    }

    public boolean isSymmetric(TreeNode root) {
        return root == null || mirror(root.left, root.right);
    }
}
