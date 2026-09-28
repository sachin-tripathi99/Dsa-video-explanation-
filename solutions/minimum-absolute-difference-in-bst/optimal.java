class Solution {
    private Integer prev = null;
    private int best = Integer.MAX_VALUE;

    public int getMinimumDifference(TreeNode root) {
        inorder(root);
        return best;
    }

    private void inorder(TreeNode n) {
        if (n == null) return;
        inorder(n.left);
        if (prev != null) best = Math.min(best, n.val - prev);   // sorted: compare with the neighbour
        prev = n.val;
        inorder(n.right);
    }
}
