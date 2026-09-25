class Solution {
    public TreeNode searchBST(TreeNode root, int val) {
        if (root == null || root.val == val) return root;
        TreeNode left = searchBST(root.left, val);        // search everywhere
        return left != null ? left : searchBST(root.right, val);
    }
}
