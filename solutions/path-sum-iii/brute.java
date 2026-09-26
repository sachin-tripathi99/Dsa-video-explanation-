class Solution {
    public int pathSum(TreeNode root, int targetSum) {
        if (root == null) return 0;
        return from(root, targetSum) + pathSum(root.left, targetSum) + pathSum(root.right, targetSum);   // every start
    }

    private int from(TreeNode n, long remain) {             // paths starting at n
        if (n == null) return 0;
        remain -= n.val;
        return (remain == 0 ? 1 : 0) + from(n.left, remain) + from(n.right, remain);
    }
}
