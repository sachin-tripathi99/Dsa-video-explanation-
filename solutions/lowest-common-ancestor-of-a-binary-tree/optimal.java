class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        TreeNode a = lowestCommonAncestor(root.left, p, q);
        TreeNode b = lowestCommonAncestor(root.right, p, q);
        if (a != null && b != null) return root;            // p and q on different sides
        return a != null ? a : b;                           // pass up whatever was found
    }
}
