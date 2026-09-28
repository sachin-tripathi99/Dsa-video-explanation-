class Solution {
    public int rob(TreeNode root) {
        if (root == null) return 0;
        int take = root.val;                                // rob it: jump to grandchildren
        if (root.left != null) take += rob(root.left.left) + rob(root.left.right);
        if (root.right != null) take += rob(root.right.left) + rob(root.right.right);
        int skip = rob(root.left) + rob(root.right);        // skip it: children are free
        return Math.max(take, skip);
    }
}
