class Solution {
    public boolean hasPathSum(TreeNode root, int targetSum) {
        if (root == null) return false;
        int remain = targetSum - root.val;
        if (root.left == null && root.right == null) return remain == 0;   // leaf
        return hasPathSum(root.left, remain) || hasPathSum(root.right, remain);
    }
}
